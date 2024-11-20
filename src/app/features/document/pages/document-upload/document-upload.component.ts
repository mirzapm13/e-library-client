import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
    FormArray,
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
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
    ],
    templateUrl: './document-upload.component.html',
    styleUrl: './document-upload.component.scss',
})
export class DocumentUploadComponent implements OnInit {
    uploadForm: FormGroup;
    categories: any;
    users: any = [];
    selectedFile: File | null = null;

    constructor(
        private router: Router,
        private categoryService: CategoryService,
        private fb: FormBuilder,
        private usersService: UsersService,
        private documentService: DocumentService,
        private notify: NotifyService
    ) {
        this.uploadForm = this.fb.group({
            file: [],
            doc_number: [''],
            title: [''],
            description: [''],
            selectedCategory: [''],
            criteria: [''],
            release: [false],
            expiredAt: [''],
            tags: [[]],
        });
    }

    loading = false;

    ngOnInit(): void {
        this.categoryService.getCategories().subscribe(({ error, value }) => {
            if (error) return;

            const mapped = value.data.map((item) => ({
                ...item,
                label: item.name,
                id: item.id,
            }));

            const grouped = groupByParent(mapped, 'children', 'parent_id');

            this.categories = grouped;
        });
    }

    clickBack() {
        this.router.navigateByUrl('/library/dokumen');
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

        console.log(this.uploadForm.value);

        const fileFormData = new FormData();
        fileFormData.append('file', this.uploadForm.value.file);

        let payload = this.uploadForm.value;
        delete payload['file'];

        payload = {
            ...payload,
            expired_at: this.formatDate(payload.expiredAt),
            ...(payload.selectedCategory && {
                category_id: payload.selectedCategory.id,
            }),
        };

        // console.log(payload);

        // return;

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

    //==== dynamic form

    createItem(): FormGroup {
        return this.fb.group({
            item: [],
        });
    }

    addNameField(): void {
        this.approvals.push(this.createItem());
    }

    get approvals(): FormArray {
        return this.uploadForm.get('approvals') as FormArray;
    }

    onFilePicked(event) {
        console.log(event);
        const file = (event.target as HTMLInputElement).files[0]; // Here we use only the first file (single file)
        this.uploadForm.patchValue({ file: file });
        // this.selectedFile = this.selectedFile;
    }
}
