import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PDFDocument, rgb } from 'pdf-lib';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { switchMap } from 'rxjs';
import { SafePipe } from 'src/app/shared/pipes/safe-url-pipe';
import { DocumentService } from 'src/app/shared/services/document.service';
import { download } from 'src/app/shared/utils/download-file';

@Component({
    selector: 'app-document-approval-details',
    standalone: true,
    imports: [ButtonModule, SafePipe, CommonModule, TableModule, DialogModule],
    templateUrl: './document-approval-details.component.html',
    styleUrl: './document-approval-details.component.scss',
})
export class DocumentApprovalDetailsComponent {
    constructor(
        private documentService: DocumentService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    isOpen = false;
    currentDoc: any;
    currentDateTime = new Date();
    approvals = [
        {
            id: '1',
            name: 'Kadep DevOps',
            status: 'approved',
        },
        {
            id: '3',
            name: 'Kadep HR',
            status: 'waiting',
        },
    ];

    ngOnInit(): void {
        // this.docSrc = 'assets/docs/sample.pdf';
        this.route.paramMap
            .pipe(
                switchMap((params) => {
                    const id = params.get('id');
                    return this.documentService.getDocument(params.get('id'));
                })
            )
            .subscribe((data) => {
                console.log(data);
                this.currentDoc = data;
            });
    }

    async downloadPdf() {
        // Fetch an existing PDF document
        const url = this.currentDoc.docSrc;
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

    showDialog() {
        this.isOpen = true;
    }

    clickBack() {
        console.log('clicked');
        this.router.navigateByUrl('/library/approval');
    }
}