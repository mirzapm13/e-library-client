import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    ValidationErrors,
    Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ChipsModule } from 'primeng/chips';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TreeSelectModule } from 'primeng/treeselect';
import {
    debounceTime,
    distinctUntilChanged,
    filter,
    Subject,
    switchMap,
} from 'rxjs';
import { CategoryService } from 'src/app/shared/services/category.service';
import { groupByParent } from 'src/app/shared/utils/group-by-parent';
import { CheckboxModule } from 'primeng/checkbox';
import { DocumentService } from 'src/app/shared/services/document.service';
import { NotifyService } from 'src/app/shared/services/notify.service';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TableModule } from 'primeng/table';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-document-upload',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        InputSwitchModule,
        InputTextModule,
        TreeSelectModule,
        FormsModule,
        ReactiveFormsModule,
        FileUploadModule,
        RadioButtonModule,
        CalendarModule,
        ChipsModule,
        DropdownModule,
        DividerModule,
        CheckboxModule,
        AutoCompleteModule,
        TableModule,
    ],
    templateUrl: './document-upload.component.html',
    styleUrl: './document-upload.component.scss',
})
export class DocumentUploadComponent implements OnInit {
    uploadForm: FormGroup;
    categories: any;
    users: any = [];
    selectedFile: File | null = null;

    references = [];

    referenceOptions = [
        {
            label: 'Pencabutan',
            value: 'pencabutan',
        },
        {
            label: 'Perubahan',
            value: 'perubahan',
        },
        {
            label: 'Hanya Referensi',
            value: 'referensi',
        },
    ];

    statusOptions = [
        {
            label: 'active',
            value: 'active',
        },
        {
            label: 'inactive',
            value: 'inactive',
        },
    ];

    constructor(
        private router: Router,
        private categoryService: CategoryService,
        private fb: FormBuilder,
        private documentService: DocumentService,
        private notify: NotifyService,
        private location: Location
    ) {
        this.uploadForm = this.fb.group({
            file: [null, [Validators.required]],
            document_no: ['', Validators.required],
            title: ['', Validators.required],
            description: [''],
            selectedCategory: ['', Validators.required],
            criteria: ['', Validators.required],
            announce: ['false', Validators.required],
            expired_at: [''],
            tags: [[], Validators.required],
        });
    }

    loading = false;

    searchKey: any = '';
    searchResult = [];
    searchSub = new Subject<string>();

    onCheckboxChange(event: any): void {
        const value = event.checked ? 'true' : 'false';
        this.uploadForm.get('announce')?.setValue(value);
    }

    ngOnInit(): void {
        this.loading = true;
        this.categoryService
            .getCategoryByCurrentRole()
            .subscribe(({ error, value }) => {
                if (error) return;

                const mapped = value.data.map((item) => ({
                    ...item,
                    label: item.name,
                    id: item.id,
                    selectable: false,
                }));

                const grouped = groupByParent(mapped, 'children', 'parent_id');

                this.categories = grouped;

                this.loading = false;
            });

        this.searchSub
            .asObservable()
            .pipe(
                filter((text) => text.length >= 3),
                debounceTime(500),
                distinctUntilChanged(),
                switchMap((searchterm) =>
                    this.documentService.getDocuments({
                        status: '',
                        keyword: searchterm,
                    })
                )
            )
            .subscribe(({ error, value }) => {
                this.searchResult = value.data.map((item) => ({
                    number_title: `${item.document_no} - ${item.title}`,
                    ...item,
                }));
            });
    }

    clickBack() {
        this.location.back();
    }

    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    onSubmit() {
        this.loading = true;

        if (!this.uploadForm.valid) {
            this.loading = false;
            this.showAllValidationErrors(this.uploadForm);
            return;
        }

        for (let reference of this.references) {
            if (!reference.status) {
                this.notify.alert('error', 'Reference status is required');
                this.loading = false;

                return;
            }

            if (!reference.type) {
                this.notify.alert('error', 'Reference type is required');
                this.loading = false;

                return;
            }
        }

        const fileFormData = new FormData();
        fileFormData.append('file', this.uploadForm.value.file);

        let payload = this.uploadForm.value;
        delete payload['file'];

        payload = {
            ...payload,
            expired_at:
                payload.expired_at && this.formatDate(payload.expired_at),
            tags: payload.tags?.join(', '),
            ...(payload.selectedCategory && {
                category_id: payload.selectedCategory.id,
            }),
            reference: this.references.map(({ id, status, type, ...item }) => ({
                reference_id: id,
                status,
                type,
            })),
        };

        this.documentService
            .uploadFile(fileFormData)
            .subscribe(({ error, value }) => {
                if (error) {
                    this.notify.alert('error', error.message);
                    this.loading = false;
                    return;
                }

                let filename = value.data.filename;

                payload['filename'] = filename;
                // delete payload['expired_at'];
                delete payload['selectedCategory'];

                // console.log(payload);

                // return;

                this.documentService
                    .addDocument(payload)
                    .subscribe(({ error, value }) => {
                        if (error) {
                            this.notify.alert('error', error.message);
                            this.loading = false;
                            return;
                        }

                        // console.log(value);

                        this.notify.alert('success', value.message);
                        this.location.back();
                        this.loading = false;
                    });

                // console.log(data);
            });
    }

    onFilePicked(event) {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0]; // Use optional chaining to avoid null/undefined errors

        let maxFileSize = 10;

        const maxSizeInBytes = Number(environment.uploadMaxSize) * 1024 * 1024; // 10 MB
        const allowedMimeType = 'application/pdf';

        if (file.size > maxSizeInBytes) {
            this.notify.alert('error', `Max file size is ${maxFileSize}MB`);
            input.value = ''; // Clear the file input
            this.uploadForm.patchValue({ file: null });
            return;
        }

        if (file.type !== allowedMimeType) {
            this.notify.alert('error', `Only PDF is allowed`);
            input.value = ''; // Clear the file input
            this.uploadForm.patchValue({ file: null });

            return;
        }

        this.uploadForm.patchValue({ file: file });
    }

    private showAllValidationErrors(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach((field) => {
            const control = formGroup.get(field);
            if (control) {
                control.markAsTouched({ onlySelf: true });
            }
        });
    }

    search(evt) {
        this.searchSub.next(evt.query);
    }

    addReference() {
        if (typeof this.searchKey == 'string') {
            this.notify.alert(
                'warn',
                `Please insert the correct document number`
            );
            return;
        }

        if (
            this.references.some(
                (item) => item.document_no == this.searchKey.document_no
            )
        ) {
            this.notify.alert(
                'warn',
                `Document ${this.searchKey.document_no} is already added`
            );
            this.searchKey = '';
            return;
        }

        this.references.push(this.searchKey);

        // console.log(this.references);

        this.searchKey = '';
    }

    deleteReference(idx) {
        this.references.splice(idx, 1);
    }

    changeReferenceOption(doc) {
        if (doc.type == 'pencabutan' || doc.type == 'perubahan') {
            doc.status = 'inactive';
        }

        if (
            doc.type == 'referensi' &&
            doc.document_no == this.uploadForm.get('document_no')?.value &&
            doc.status == 'active'
        ) {
            doc.status = 'inactive';
            doc.type = 'perubahan';
            this.notify.alert(
                'error',
                "Can not have the same document number for active 'Hanya Referensi'"
            );

            return;
        }
    }

    clearDate() {
        this.uploadForm.get('expired_at')?.setValue('');
    }

    clearCategory() {
        this.uploadForm.get('selectedCategory')?.setValue('');
    }
}
