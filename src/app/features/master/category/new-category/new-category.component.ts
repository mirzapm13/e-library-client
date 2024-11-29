import { CommonModule, Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { TreeSelectModule } from 'primeng/treeselect';
import { CategoryService } from 'src/app/shared/services/category.service';
import { NotifyService } from 'src/app/shared/services/notify.service';
import { groupByParent } from 'src/app/shared/utils/group-by-parent';

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
        private notify: NotifyService,
        private router: Router
    ) {
        this.newCategoryForm = this.fb.group({
            name: [null, Validators.required],
            status: [false, Validators.required],
            description: [null],
            parent_id: [null],
        });
    }
    categories = [];
    categoryOptions = [];

    loading = false;
    ngOnInit(): void {
        this.loading = true;

        this.categoryService.getCategories().subscribe(({ error, value }) => {
            if (error) return;
            console.log(value.data);
            this.categories = value.data.map((item) => ({
                ...item,
                label: item.name,
            }));

            this.categoryOptions = groupByParent(
                this.categories,
                'children',
                'parent_id'
            );
            // this.categoryOptions = recursiveMap(
            //     this.categoryOptions,
            //     (data) => ({ ...data }),
            //     'children'
            // );
        });

        this.loading = false;
    }

    clickBack() {
        this.location.back();
    }

    onSubmit() {
        this.loading = true;

        let payload = this.newCategoryForm.value;
        payload = { ...payload, parent_id: payload.parent_id?.id };
        console.log(payload);

        if (!this.newCategoryForm.valid) {
            console.log('not valid');
            this.loading = false;
            return;
        }

        this.categoryService
            .addCategory(payload)
            .subscribe(({ isLoading, error, value }) => {
                if (error) {
                    this.notify.alert('error', error.message);
                    this.loading = false;
                    return;
                }

                this.notify.alert('success', value.message);
                // this.router.navigateByUrl('/master-data/category');
                this.location.back();
                this.loading = false;
            });
    }
}
