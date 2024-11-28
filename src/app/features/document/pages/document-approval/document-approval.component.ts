import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TreeNode } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { TreeSelectModule } from 'primeng/treeselect';
import {
    CategoryService,
    ICategoryState,
} from 'src/app/shared/services/category.service';
import { DocumentService } from 'src/app/shared/services/document.service';

import { groupByParentHierarchy } from 'src/app/shared/utils/group-by-parent-hierarchy';

@Component({
    selector: 'app-document-approval',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        InputTextModule,
        TreeSelectModule,
        DataViewModule,
        MenubarModule,
    ],
    templateUrl: './document-approval.component.html',
    styleUrl: './document-approval.component.scss',
})
export class DocumentApprovalComponent {
    constructor(
        private categoryService: CategoryService,
        private documentService: DocumentService,
        private router: Router
    ) {}

    categories: ICategoryState;

    currentDateTime = new Date();
    selectedCategory: TreeNode[];

    documents = [];

    selectedChild;

    docLoading = false;

    ngOnInit(): void {
        this.docLoading = true;
        this.documentService
            .getDocuments({ status: 'approver' })
            .subscribe(({ error, value }) => {
                if (error) return;
                this.documents = value.data;
                this.docLoading = false;
            });

        this.categoryService
            .getCategoryByCurrentRole()
            .subscribe(({ error, value }) => {
                const mapped = value.data.map((item) => {
                    return {
                        ...item,
                        label: item.name,
                        id: item.id,
                    };
                });
                const grouped = groupByParentHierarchy(
                    mapped,
                    'items',
                    'parent_id',
                    'name',
                    (obj) => {
                        if (!obj.selectable) return;
                        this.selectedChild = obj;
                        // this.filters.category = obj.id;
                        // this.applyFilter();
                    }
                );
                this.categories = grouped;
            });
    }

    onTabChange(data) {
        console.log(data);
    }

    goToDocument(id) {
        this.router.navigateByUrl(`/library/document/${id}`);
    }

    categoryIndicator() {
        let indicator = [
            ...(this.selectedChild?.hierarchy
                ? this.selectedChild.hierarchy
                : []),
        ];

        if (this.selectedChild?.name) indicator.push(this.selectedChild.name);

        if (indicator.length) {
            return indicator.join(' > ');
        } else {
            return 'All Category';
        }
    }
}
