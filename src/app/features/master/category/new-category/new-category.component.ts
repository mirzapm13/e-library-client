import { CommonModule, Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { TreeSelectModule } from 'primeng/treeselect';
import { map } from 'rxjs';
import { CategoryService } from 'src/app/shared/services/category.service';
import { UsersService } from 'src/app/shared/services/users.service';
import { groupByParent } from 'src/app/shared/utils/group-by-parent';
import { recursiveMap } from 'src/app/shared/utils/recursive-map';

@Component({
    selector: 'app-new-category',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        InputSwitchModule,
        InputTextModule,
        TreeSelectModule,
        FormsModule,
        ReactiveFormsModule,
        MultiSelectModule,
    ],
    templateUrl: './new-category.component.html',
    styleUrl: './new-category.component.scss',
})
export class NewCategoryComponent implements OnInit {
    newCategoryForm: FormGroup;

    constructor(
        private location: Location,
        private categoryService: CategoryService,
        private fb: FormBuilder,
        private usersService: UsersService
    ) {
        this.newCategoryForm = this.fb.group({
            name: [''],
            status: [false],
            selectedCategory: [],
            selectedUsers: [],
        });
    }
    categories = [];
    users = [];

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
                this.users = data.value.map((data) => {
                    return { label: data.nama, value: data };
                });
                console.log(this.users);
            }
        });
    }

    clickBack() {
        this.location.back();
    }

    onSubmit() {
        console.log(this.newCategoryForm.value);
    }
}
