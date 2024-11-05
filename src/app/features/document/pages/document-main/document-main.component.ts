import { Component, OnInit } from '@angular/core';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
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

@Component({
    selector: 'app-document-main',
    templateUrl: './document-main.component.html',
    standalone: true,
    imports: [CommonModule, SafePipe, ButtonModule, TabViewModule],
})
export class DocumentMainComponent implements OnInit {
    constructor(private categoryService: CategoryService) {}
    categories: ICategoryState;

    docSrc: string;
    currentDateTime = new Date();
    selectedCategory;

    ngOnInit(): void {
        this.docSrc = 'assets/docs/sample.pdf';

        this.categoryService
            .getCategories()
            .pipe(
                map((data) => {
                    const grouped = groupByParent(data);
                    return grouped;
                })
            )
            .subscribe((data) => {
                console.log(data);
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
}
