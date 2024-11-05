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
import { TreeSelectModule } from 'primeng/treeselect';
import { map, tap } from 'rxjs';
import { CategoryService } from 'src/app/shared/services/category.service';
import { groupByParent } from 'src/app/shared/utils/group-by-parent';
import { recursiveMap } from 'src/app/shared/utils/recursive-map';
import { BrowserModule } from '@angular/platform-browser';

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
    ],
    templateUrl: './new-category.component.html',
    styleUrl: './new-category.component.scss',
})
export class NewCategoryComponent implements OnInit {
    newCategoryForm: FormGroup;

    constructor(
        private location: Location,
        private categoryService: CategoryService,
        private fb: FormBuilder
    ) {
        this.newCategoryForm = this.fb.group({
            name: [''],
            status: [false],
            selectedCategory: [],
        });
    }
    categories = [];
    // selectedCategory;

    // categories = [
    //     {
    //         label: 'Documents',
    //         data: 'Documents Folder',
    //         expandedIcon: 'pi pi-folder-open',
    //         collapsedIcon: 'pi pi-folder',
    //         children: [
    //             {
    //                 label: 'Work',
    //                 data: 'Work Folder',
    //                 expandedIcon: 'pi pi-folder-open',
    //                 collapsedIcon: 'pi pi-folder',
    //                 children: [
    //                     {
    //                         label: 'Expenses.doc',
    //                         icon: 'pi pi-file',
    //                         data: 'Expenses Document',
    //                     },
    //                     {
    //                         label: 'Resume.doc',
    //                         icon: 'pi pi-file',
    //                         data: 'Resume Document',
    //                     },
    //                 ],
    //             },
    //             {
    //                 label: 'Home',
    //                 data: 'Home Folder',
    //                 expandedIcon: 'pi pi-folder-open',
    //                 collapsedIcon: 'pi pi-folder',
    //                 children: [
    //                     {
    //                         label: 'Invoices.txt',
    //                         icon: 'pi pi-file',
    //                         data: 'Invoices for this month',
    //                     },
    //                 ],
    //             },
    //         ],
    //     },
    //     {
    //         label: 'Pictures',
    //         data: 'Pictures Folder',
    //         expandedIcon: 'pi pi-folder-open',
    //         collapsedIcon: 'pi pi-folder',
    //         children: [
    //             {
    //                 label: 'barcelona.jpg',
    //                 icon: 'pi pi-image',
    //                 data: 'Barcelona Photo',
    //             },
    //             {
    //                 label: 'logo.jpg',
    //                 icon: 'pi pi-file',
    //                 data: 'PrimeFaces Logo',
    //             },
    //             {
    //                 label: 'primeui.png',
    //                 icon: 'pi pi-image',
    //                 data: 'PrimeUI Logo',
    //             },
    //         ],
    //     },
    //     {
    //         label: 'Movies',
    //         data: 'Movies Folder',
    //         expandedIcon: 'pi pi-folder-open',
    //         collapsedIcon: 'pi pi-folder',
    //         children: [
    //             {
    //                 label: 'Al Pacino',
    //                 data: 'Pacino Movies',
    //                 children: [
    //                     {
    //                         label: 'Scarface',
    //                         icon: 'pi pi-video',
    //                         data: 'Scarface Movie',
    //                     },
    //                     {
    //                         label: 'Serpico',
    //                         icon: 'pi pi-file-video',
    //                         data: 'Serpico Movie',
    //                     },
    //                 ],
    //             },
    //             {
    //                 label: 'Robert De Niro',
    //                 data: 'De Niro Movies',
    //                 children: [
    //                     {
    //                         label: 'Goodfellas',
    //                         icon: 'pi pi-video',
    //                         data: 'Goodfellas Movie',
    //                     },
    //                     {
    //                         label: 'Untouchables',
    //                         icon: 'pi pi-video',
    //                         data: 'Untouchables Movie',
    //                     },
    //                 ],
    //             },
    //         ],
    //     },
    // ];

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
                console.log(data);
                this.categories = data;
            });
    }

    clickBack() {
        this.location.back();
    }

    onSubmit() {
        console.log(this.newCategoryForm.value);
    }
}
