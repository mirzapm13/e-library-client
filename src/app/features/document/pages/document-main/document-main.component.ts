import { Component, OnInit } from '@angular/core';
import { PDFDocument, rgb } from 'pdf-lib';
import { ButtonModule } from 'primeng/button';
import { download } from 'src/app/shared/utils/download-file';
import { SafePipe } from 'src/app/shared/pipes/safe-url-pipe';
import {
    CategoryService,
    ICategoryState,
} from 'src/app/shared/services/category.service';
import { TabViewModule } from 'primeng/tabview';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs';
import { groupByParent } from 'src/app/shared/utils/group-by-parent';
import { DataViewModule } from 'primeng/dataview';
import { TreeNode } from 'primeng/api';
import { DocumentService } from 'src/app/shared/services/document.service';
import { InputTextModule } from 'primeng/inputtext';
import { recursiveMap } from 'src/app/shared/utils/recursive-map';
import { TreeSelectModule } from 'primeng/treeselect';
import { Router } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';

@Component({
    selector: 'app-document-main',
    templateUrl: './document-main.component.html',
    styleUrl: './document-main.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        SafePipe,
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

    ngOnInit(): void {
        this.docSrc = 'assets/docs/sample.pdf';

        this.documentService.getDocuments().subscribe((data) => {
            console.log(data);
            this.documents = data;
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
                const grouped = groupByParent(mapped, 'items', 'parent_id');
                this.categories = grouped;
            });
    }

    onTabChange(data) {
        console.log(data);
    }

    async downloadPdf() {
        // Fetch an existing PDF document
        const url = this.docSrc;
        const existingPdfBytes = await fetch(url).then((res) =>
            res.arrayBuffer()
        );

        // Load a PDFDocument from the existing PDF bytes
        const pdfDoc = await PDFDocument.load(existingPdfBytes);

        const page = pdfDoc.getPage(0);
        const { width, height } = page.getSize();

        page.drawText(
            `Dokumen ini di download oleh User\n` +
                `Tanggal ${this.currentDateTime.toLocaleDateString(
                    'id-ID'
                )}\n` +
                `Pukul ${this.currentDateTime.toLocaleTimeString('id-ID')}`,
            {
                x: width - 250,
                y: 40,
                size: 12,
                color: rgb(0, 0, 0),
                lineHeight: 15,
            }
        );

        // Serialize the PDFDocument to bytes (a Uint8Array)
        const pdfBytes = await pdfDoc.save();

        // Trigger the browser to download the PDF document
        download(
            pdfBytes,
            'pdf-lib_modification_example.pdf',
            'application/pdf'
        );
    }

    goToDocument(id) {
        this.router.navigateByUrl(`/library/dokumen/${id}`);
    }

    goToUpload() {
        this.router.navigateByUrl(`/library/upload`);
    }
}
