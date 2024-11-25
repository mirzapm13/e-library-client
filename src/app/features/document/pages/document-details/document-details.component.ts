import { Component, OnDestroy, OnInit } from '@angular/core';
import { PDFDocument, rgb } from 'pdf-lib';
import { ButtonModule } from 'primeng/button';
import { download } from 'src/app/shared/utils/download-file';
// import { SafePipe } from '../../../../shared/pipes/safe-url-pipe';
import { DocumentService } from 'src/app/shared/services/document.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, switchMap } from 'rxjs';
import { CommonModule, Location } from '@angular/common';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ConfirmService } from 'src/app/shared/services/confirmation.service';
import { NotifyService } from 'src/app/shared/services/notify.service';
import { UserService } from 'src/app/core/auth/services/user.service';

@Component({
    selector: 'app-document-details',
    standalone: true,
    imports: [
        ButtonModule,
        CommonModule,
        TableModule,
        DialogModule,
        PdfViewerModule,
    ],
    templateUrl: './document-details.component.html',
    styleUrl: './document-details.component.scss',
})
export class DocumentDetailsComponent implements OnInit, OnDestroy {
    constructor(
        private documentService: DocumentService,
        private route: ActivatedRoute,
        private router: Router,
        private sanitizer: DomSanitizer,
        private location: Location,
        private confirmService: ConfirmService,
        private notify: NotifyService,
        private userService: UserService
    ) {}

    isOpen = false;
    currentDoc: any;
    currentDateTime = new Date();
    fallback = 'assets/docs/sample.pdf';
    approvals = [];

    id;

    pdfUrl: SafeResourceUrl | null = null;

    fileReader;

    pdfBlob;

    onDestroy$: Subject<boolean> = new Subject();

    detailLoading = false;
    docLoading = false;

    currentUser;
    currentApprove = false;

    ngOnInit(): void {
        this.detailLoading = true;
        this.docLoading = true;
        this.id = this.route.snapshot.paramMap.get('id');

        this.currentUser = this.userService.getUserData();
        console.log(this.currentUser);

        this.documentService
            .getDocumentById(this.id)
            .subscribe(({ error, value }) => {
                console.log(value.data);
                if (error) return;

                // console.log(value.data);

                this.currentDoc = value.data;
                let payload = { filename: value.data.filename };

                this.detailLoading = false;

                if (value.data?.approvers) {
                    if (
                        value.data.approvers.some(
                            (item) => item.email == this.currentUser.user.email
                        )
                    ) {
                        this.currentApprove = true;
                    }
                }

                this.documentService.downloadFile(payload).subscribe({
                    next: (pdfBlob) => {
                        this.pdfBlob = pdfBlob;

                        const reader = new FileReader();
                        reader.onload = () => {
                            this.pdfUrl = reader.result; // Set the PDF data as an ArrayBuffer
                            this.docLoading = false;
                        };

                        reader.readAsArrayBuffer(pdfBlob);

                        this.docLoading = false;
                    },
                    error: (err) => {
                        console.error('Failed to load PDF', err);
                        this.docLoading = false;
                    },
                });
            });
    }

    ngOnDestroy(): void {
        this.onDestroy$.next(true);
        this.onDestroy$.unsubscribe();
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
        this.location.back();
    }

    approveDocument() {
        this.confirmService.approveConfirm(
            `Are you sure want to confirm document?`,
            () => this.approveCallback(this.id)
        );
    }

    approveCallback(id) {
        this.detailLoading = true;

        this.documentService
            .approveDocument(id, { status: 'approved' })
            .subscribe(({ error, value }) => {
                if (error) {
                    this.notify.alert('error', error.message);
                    this.detailLoading = false;
                    return;
                }

                this.notify.alert('success', value.message);

                this.documentService
                    .getDocumentById(id)
                    .subscribe(({ error, value }) => {
                        if (error) {
                            this.notify.alert('error', error.message);
                            this.detailLoading = false;
                            return;
                        }
                        this.currentDoc = value.data;
                        this.detailLoading = false;
                    });
            });
        // console.log(id);
    }
}
