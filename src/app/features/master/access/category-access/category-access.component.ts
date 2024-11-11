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
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TreeSelectModule } from 'primeng/treeselect';
import { map } from 'rxjs';
import { CategoryService } from 'src/app/shared/services/category.service';
import { groupByParent } from 'src/app/shared/utils/group-by-parent';
import { recursiveMap } from 'src/app/shared/utils/recursive-map';

@Component({
    selector: 'app-category-access',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        FormsModule,
        ReactiveFormsModule,
        InputTextModule,
        DropdownModule,
        DividerModule,
        TreeSelectModule,
    ],
    templateUrl: './category-access.component.html',
    styleUrl: './category-access.component.scss',
})
export class CategoryAccessComponent implements OnInit {
    categoryAccessForm: FormGroup;
    categoryOptions: any;

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private categoryService: CategoryService
    ) {
        this.categoryAccessForm = this.fb.group({
            nama: [],
            jabatan: [],
            categories: this.fb.array([this.createItem()]),
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
                this.categoryOptions = data;
            });
    }

    clickBack() {
        this.router.navigateByUrl('/master-data/access');
    }

    createItem(): FormGroup {
        return this.fb.group({
            item: [],
        });
    }

    addCategoryField(): void {
        this.categories.push(this.createItem());
    }

    get categories(): FormArray {
        return this.categoryAccessForm.get('categories') as FormArray;
    }
}
