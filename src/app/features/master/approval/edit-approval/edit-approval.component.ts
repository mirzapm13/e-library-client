import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
    FormArray,
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TreeSelectModule } from 'primeng/treeselect';
import { map } from 'rxjs';
import { CategoryService } from 'src/app/shared/services/category.service';
import { groupByParent } from 'src/app/shared/utils/group-by-parent';
import { recursiveMap } from 'src/app/shared/utils/recursive-map';

@Component({
    selector: 'app-edit-approval',
    standalone: true,
    imports: [
        ButtonModule,
        ReactiveFormsModule,
        CommonModule,
        InputTextModule,
        DropdownModule,
        CascadeSelectModule,
        TreeSelectModule,
        DividerModule,
    ],
    templateUrl: './edit-approval.component.html',
    styleUrl: './edit-approval.component.scss',
})
export class EditApprovalComponent {
    editApprovalForm: FormGroup;
    categoryOptions = [];

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private categoryService: CategoryService
    ) {
        this.editApprovalForm = this.fb.group({
            name: [],
            status: [],
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
        this.router.navigateByUrl('/master-data/approval');
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
        return this.editApprovalForm.get('categories') as FormArray;
    }
}
