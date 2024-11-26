import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { TreeSelectModule } from 'primeng/treeselect';
import { CategoryService } from 'src/app/shared/services/category.service';
import { NotifyService } from 'src/app/shared/services/notify.service';
import { groupByParent } from 'src/app/shared/utils/group-by-parent';
import { recursiveMap } from 'src/app/shared/utils/recursive-map';

@Component({
    selector: 'app-edit-category',
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
    templateUrl: './edit-category.component.html',
    styleUrl: './edit-category.component.scss',
})
export class EditCategoryComponent {
    editCategoryForm: FormGroup;
    id;

    constructor(
        private location: Location,
        private categoryService: CategoryService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private notify: NotifyService
    ) {
        this.editCategoryForm = this.fb.group({
            name: [null, Validators.required],
            status: [false, Validators.required],
            description: [null],
            parent_id: [null],
        });
    }
    categories = [];
    defaultParent;
    categoryOptions;

    loading = false;

    ngOnInit(): void {
        this.loading = true;
        this.id = this.route.snapshot.paramMap.get('id');

        this.categoryService
            .getCategories()
            .subscribe(({ isLoading, error, value }) => {
                if (error) return;
                this.categories = value.data.map((item) => ({
                    ...item,
                    label: item.name,
                    key: item.id,
                }));

                this.categoryOptions = groupByParent(
                    this.categories,
                    'children'
                );
                // this.categoryOptions = recursiveMap(
                //     this.categoryOptions,
                //     (data) => ({ ...data }),
                //     'children'
                // );
                this.categoryService
                    .getCategoryById(this.id)
                    .subscribe(({ isLoading, error, value }) => {
                        if (error) return;

                        this.defaultParent = this.categories.filter((item) => {
                            return item.id == value.data.parentId;
                        })[0];

                        let patchData = {
                            ...value.data,
                            parent_id: this.defaultParent,
                        };
                        console.log(patchData);
                        this.editCategoryForm.patchValue(patchData);

                        this.loading = false;
                    });
            });
    }

    clickBack() {
        this.location.back();
    }

    onSubmit() {
        this.loading = true;

        let payload = this.editCategoryForm.value;
        payload = { ...payload, parent_id: payload.parent_id?.id };
        console.log(payload);
        if (!this.editCategoryForm.valid) {
            console.log('not valid');
            return;
        }

        this.categoryService
            .editCategory(this.id, payload)
            .subscribe(({ isLoading, error, value }) => {
                if (error) {
                    this.notify.alert('error', error.message);
                    this.loading = false;
                    return;
                }

                console.log(value);
                this.notify.alert('success', value.message);
                this.loading = false;
            });
    }
}
