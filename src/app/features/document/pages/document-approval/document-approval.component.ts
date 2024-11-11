import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PDFDocument, rgb } from 'pdf-lib';
import { TreeNode } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { TreeSelectModule } from 'primeng/treeselect';
import { map } from 'rxjs';
import {
    CategoryService,
    ICategoryState,
} from 'src/app/shared/services/category.service';
import { DocumentService } from 'src/app/shared/services/document.service';
import { download } from 'src/app/shared/utils/download-file';
import { groupByParent } from 'src/app/shared/utils/group-by-parent';
import { recursiveMap } from 'src/app/shared/utils/recursive-map';

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
                        'items'
                    );
                    return mapped;
                })
            )
            .subscribe((data) => {
                this.categories = data;
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
        this.router.navigateByUrl(`/library/approval/${id}`);
    }
}
