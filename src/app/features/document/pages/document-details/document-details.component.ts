import { Component, OnInit } from '@angular/core';
import { PDFDocument, rgb } from 'pdf-lib';
import { ButtonModule } from 'primeng/button';
import { download } from 'src/app/shared/utils/download-file';
// import { SafePipe } from '../../../../shared/pipes/safe-url-pipe';
import { DocumentService } from 'src/app/shared/services/document.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
    selector: 'app-document-details',
    standalone: true,
    imports: [
        ButtonModule,
        // SafePipe,
        CommonModule,
        TableModule,
        DialogModule,
        PdfViewerModule,
    ],
    templateUrl: './document-details.component.html',
    styleUrl: './document-details.component.scss',
})
export class DocumentDetailsComponent implements OnInit {
    constructor(
        private documentService: DocumentService,
        private route: ActivatedRoute,
        private router: Router,
        private sanitizer: DomSanitizer
    ) {}

    isOpen = false;
    currentDoc: any;
    currentDateTime = new Date();
    fallback = 'assets/docs/sample.pdf';
    approvals = [];

    id;

    pdfUrl: SafeResourceUrl | null = null;
    loading: boolean = false;

    fileReader;

    pdfBlob;

    ngOnInit(): void {
        this.loading = true;
        this.id = this.route.snapshot.paramMap.get('id');

        this.documentService
            .getDocumentById(this.id)
            .subscribe(({ error, value }) => {
                if (error) return;

                this.currentDoc = value.data;
                let payload = { filename: value.data.filename };

                this.documentService.downloadFile(payload).subscribe({
                    next: (pdfBlob) => {
                        // Create a Blob URL and sanitize it
                        // const url = URL.createObjectURL(pdfBlob);
                        // this.pdfUrl =
                        //     this.sanitizer.bypassSecurityTrustResourceUrl(url);

                        this.pdfBlob = pdfBlob;

                        const reader = new FileReader();
                        reader.onload = () => {
                            this.pdfUrl = reader.result; // Set the PDF data as an ArrayBuffer
                            this.loading = false;
                        };

                        reader.readAsArrayBuffer(pdfBlob);

                        this.loading = false;
                    },
                    error: (err) => {
                        console.error('Failed to load PDF', err);
                        this.loading = false;
                    },
                });
            });
    }

    async downloadPdf() {
        let arrBuff = await this.pdfBlob
            .arrayBuffer()
            .then((arrayBuffer) => {
                return arrayBuffer;
            })
            .catch((error) => {
                console.error('Failed to convert Blob to ArrayBuffer:', error);
            });

        // Load a PDFDocument from the existing PDF bytes
        const pdfDoc = await PDFDocument.load(arrBuff);

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

    showDialog() {
        this.isOpen = true;
    }

    clickBack() {
        this.router.navigateByUrl('/library/document');
    }

    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }
}
