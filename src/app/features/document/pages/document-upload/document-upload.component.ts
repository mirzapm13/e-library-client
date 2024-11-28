import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
    FormArray,
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
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
import { map } from 'rxjs';
import { UsersService } from 'src/app/shared/services/users.service';
import { CategoryService } from 'src/app/shared/services/category.service';
import { groupByParent } from 'src/app/shared/utils/group-by-parent';
import { recursiveMap } from 'src/app/shared/utils/recursive-map';
import { CheckboxModule } from 'primeng/checkbox';
import { DocumentService } from 'src/app/shared/services/document.service';
import { NotifyService } from 'src/app/shared/services/notify.service';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TableModule } from 'primeng/table';

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

    references = [
        {
            document_no: 'XX9/001/GHK',
            type: 'pencabutan',
            active: false,
            id: 'd7519b04-c894-4672-b98b-315ab7a87299',
        },
        {
            document_no: 'XX9/002/GHK',
            type: 'perubahan',
            active: false,
            id: 'asdadadad1323',
        },
        {
            document_no: 'XX9/003/GHK',
            type: 'referensi',
            active: false,
            id: 'asdadadad1323',
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
            file: ['', Validators.required],
            document_no: ['', Validators.required],
            title: ['', Validators.required],
            description: [''],
            selectedCategory: ['', Validators.required],
            criteria: ['', Validators.required],
            release: [false, Validators.required],
            expiredAt: [''],
            tags: [[]],
        });
    }

    loading = false;

    ngOnInit(): void {
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

        const fileFormData = new FormData();
        fileFormData.append('file', this.uploadForm.value.file);

        let payload = this.uploadForm.value;
        delete payload['file'];

        payload = {
            ...payload,
            expired_at:
                payload.expired_at && this.formatDate(payload.expiredAt),
            tags: payload.tags?.join(', '),
            ...(payload.selectedCategory && {
                category_id: payload.selectedCategory.id,
            }),
        };

        console.log(payload);

        return;

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
                delete payload['expiredAt'];
                delete payload['selectedCategory'];

                console.log(payload);

                // return;

                this.documentService
                    .addDocument(payload)
                    .subscribe(({ error, value }) => {
                        if (error) {
                            this.notify.alert('error', error.message);
                            this.loading = false;
                            return;
                        }

                        console.log(value);

                        this.notify.alert('success', value.message);
                        // this.router.navigateByUrl('/master-data/category');
                        this.loading = false;
                    });

                // console.log(data);
            });
    }

    onFilePicked(event) {
        console.log(event);
        const file = (event.target as HTMLInputElement).files[0]; // Here we use only the first file (single file)
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
}
