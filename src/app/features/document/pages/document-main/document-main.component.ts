import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SafePipe } from 'src/app/shared/pipes/safe-url-pipe';
import { CategoryService } from 'src/app/shared/services/category.service';
import { TabViewModule } from 'primeng/tabview';
import { CommonModule } from '@angular/common';
import { DataViewModule } from 'primeng/dataview';
import { TreeNode } from 'primeng/api';
import { DocumentService } from 'src/app/shared/services/document.service';
import { InputTextModule } from 'primeng/inputtext';
import { TreeSelectModule } from 'primeng/treeselect';
import { Router } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { groupByParentHierarchy } from 'src/app/shared/utils/group-by-parent-hierarchy';

@Component({
    selector: 'app-document-main',
    templateUrl: './document-main.component.html',
    styleUrl: './document-main.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        TabViewModule,
        DataViewModule,
        InputTextModule,
        TreeSelectModule,
        MenubarModule,
    ],
})
export class DocumentMainComponent implements OnInit {
    constructor(
        private categoryService: CategoryService,
        private documentService: DocumentService,
        private router: Router
    ) {}

    categories = [];

    docSrc: string;
    currentDateTime = new Date();
    selectedCategory: TreeNode[];

    documents = [];

    selectedChild;

    ngOnInit(): void {
        this.docSrc = 'assets/docs/sample.pdf';

        this.documentService.getDocuments().subscribe(({ error, value }) => {
            if (error) return;
            // console.log(data);
            this.documents = value.data;
        });

        this.categoryService
            .getCategoryByCurrentRole()
            .subscribe(({ error, value }) => {
                console.log(value.data);
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
                        this.selectedChild = obj;
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

    goToUpload() {
        this.router.navigateByUrl(`/library/upload`);
    }

    clickMenu(item) {
        console.log(item);
    }

    onfocus(evt) {
        console.log(evt);
    }

    log() {
        console.log('tset');
    }
}
