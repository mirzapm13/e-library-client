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
    ],
    templateUrl: './document-upload.component.html',
    styleUrl: './document-upload.component.scss',
})
export class DocumentUploadComponent implements OnInit {
    uploadForm: FormGroup;
    categories: any;
    users: any = [];

    constructor(
        private router: Router,
        private categoryService: CategoryService,
        private fb: FormBuilder,
        private usersService: UsersService
    ) {
        this.uploadForm = this.fb.group({
            name: [''],
            short_desc: [''],
            long_desc: [''],
            // status: [false],
            selectedCategory: [],
            files: [[]],
            kriteria: [],
            klasifikasi: [],
            expired: [],
            tags: [[]],
            approvals: this.fb.array([this.createItem()]),
        });
    }

    ngOnInit(): void {
        this.categoryService
            .getCategories()
            .pipe(
                map((data) => {
                    const grouped = groupByParent(data);
                    const mapped = recursiveMap(
                        grouped,
                        (item) => {
                            return {
                                label: item.name,
                                id: item.id,
                                ...(item.items && { children: item.items }),
                            };
                        },
                        'children'
                    );
                    return mapped;
                })
            )
            .subscribe((data) => {
                this.categories = data;
            });

        this.usersService.getUsers().subscribe((data) => {
            if (data.value) {
                const mapped = data.value.map((item) => {
                    return { ...item, label: item.nama, value: item.id };
                });
                this.users = mapped;
                console.log(mapped);
            }
        });
    }

    clickBack() {
        this.router.navigateByUrl('/library/dokumen');
    }

    onSubmit() {
        console.log(this.uploadForm.value);
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
}
