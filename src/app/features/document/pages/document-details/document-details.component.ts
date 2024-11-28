import { Component, OnDestroy, OnInit } from '@angular/core';
import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
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
import { CategoryService } from 'src/app/shared/services/category.service';

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
        private location: Location,
        private confirmService: ConfirmService,
        private notify: NotifyService,
        private userService: UserService,
        private categoryService: CategoryService
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

    categoryApprover;

    //==== dummy references

    references = [
        {
            document_no: 'XX9/001/GHK',
            type: 'pencabutan',
            active: false,
            id: 'd7519b04-c894-4672-b98b-315ab7a87299',
        },
        {
            document_no: 'XX9/002/GHK',
            type: 'perubahan',
            active: false,
            id: 'asdadadad1323',
        },
        {
            document_no: 'XX9/003/GHK',
            type: 'referensi',
            active: false,
            id: 'asdadadad1323',
        },
    ];

    ngOnInit(): void {
        this.detailLoading = true;
        this.docLoading = true;

        this.id = this.route.snapshot.paramMap.get('id');

        this.currentUser = this.userService.getUserData();

        this.documentService
            .getDocumentById(this.id)
            .subscribe(({ error, value }) => {
                if (error) return;

                this.currentDoc = value.data;

                let payload = { filename: value.data.filename };

                if (
                    value.data?.approvers.some(
                        (item) => item.email == this.currentUser.user.email
                    )
                ) {
                    this.currentApprove = true;
                }

                this.categoryService
                    .getCategoryById(this.currentDoc.categoryId)
                    .subscribe(({ error, value }) => {
                        if (error) return;

                        this.categoryApprover = value.data.users;
                        this.detailLoading = false;
                    });

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

        const pages = pdfDoc.getPages();

        let textSize = 32;

        const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const textHeight = helveticaFont.heightAtSize(textSize);

        const userWidth = helveticaFont.widthOfTextAtSize(
            `Downloaded by ${this.currentUser.user.name}`,
            textSize
        );

        const dateWidth = helveticaFont.widthOfTextAtSize(
            `At ${this.currentDateTime.toLocaleDateString('id-ID')}`,
            textSize
        );

        const timeWidth = helveticaFont.widthOfTextAtSize(
            `${this.currentDateTime.toLocaleTimeString('id-ID')}`,
            textSize
        );

        // let xPosition = -20;

        pages.forEach((page) => {
            // page.drawText(`Downloaded by ${this.currentUser.user.name}`, {
            //     x: page.getWidth() / 2 - userWidth / 2 + 200 + xPosition,
            //     y: page.getHeight() / 2 - textHeight / 2 + 350,
            //     size: textSize,
            //     font: helveticaFont,
            //     color: rgb(0.95, 0.1, 0.1),
            //     opacity: 0.5,
            //     rotate: degrees(-60),
            // });

            // page.drawText(
            //     `At ${this.currentDateTime.toLocaleDateString('id-ID')}`,
            //     {
            //         x: page.getWidth() / 2 - dateWidth / 2 + 70 + xPosition,
            //         y: page.getHeight() / 2 - textHeight / 2 + 170,
            //         size: textSize,
            //         font: helveticaFont,
            //         color: rgb(0.95, 0.1, 0.1),
            //         opacity: 0.5,
            //         rotate: degrees(-60),
            //     }
            // );

            // page.drawText(
            //     `${this.currentDateTime.toLocaleTimeString('id-ID')}`,
            //     {
            //         x: page.getWidth() / 2 - timeWidth / 2 - 10 + xPosition,
            //         y: page.getHeight() / 2 - textHeight / 2 + 100,
            //         size: textSize,
            //         font: helveticaFont,
            //         color: rgb(0.95, 0.1, 0.1),
            //         opacity: 0.5,
            //         rotate: degrees(-60),
            //     }
            // );

            page.drawText(`Downloaded by ${this.currentUser.user.name}`, {
                x: page.getWidth() / 2 - userWidth / 2,
                y: page.getHeight() / 2 - textHeight / 2 + 40,
                size: textSize,
                font: helveticaFont,
                color: rgb(0.95, 0.1, 0.1),
                opacity: 0.5,
            });

            page.drawText(
                `At ${this.currentDateTime.toLocaleDateString('id-ID')}`,
                {
                    x: page.getWidth() / 2 - dateWidth / 2,
                    y: page.getHeight() / 2 - textHeight / 2,
                    size: textSize,
                    font: helveticaFont,
                    color: rgb(0.95, 0.1, 0.1),
                    opacity: 0.5,
                    // rotate: degrees(-60),
                }
            );

            page.drawText(
                `${this.currentDateTime.toLocaleTimeString('id-ID')}`,
                {
                    x: page.getWidth() / 2 - timeWidth / 2,
                    y: page.getHeight() / 2 - textHeight / 2 - 40,
                    size: textSize,
                    font: helveticaFont,
                    color: rgb(0.95, 0.1, 0.1),
                    opacity: 0.5,
                    // rotate: degrees(-60),
                }
            );
        });

        // Serialize the PDFDocument to bytes (a Uint8Array)
        const pdfBytes = await pdfDoc.save();

        this.pdfUrl = pdfBytes;

        // Trigger the browser to download the PDF document
        // download(
        //     pdfBytes,
        //     'pdf-lib_modification_example.pdf',
        //     'application/pdf'
        // );
    }

    showDialog() {
        this.isOpen = true;
    }

    clickBack() {
        this.location.back();
    }

    checkApprovalFlow() {
        let categoryAppArray = this.categoryApprover.map((item) => item.name);
        let currentDocAppArray = this.currentDoc.approvers.map(
            (item) => item.name
        );

        const haveSameContents = (a, b) =>
            a.length === b.length &&
            a.every(
                (v) =>
                    a.filter((e) => e === v).length ===
                    b.filter((e) => e === v).length
            );

        return haveSameContents(categoryAppArray, currentDocAppArray);
    }

    approveDocument() {
        let text = '';
        if (!this.checkApprovalFlow()) {
            text = `<br/> <br/> *The approval flow for this category of the document is already altered. Do you want to proceed?`;
        }

        this.confirmService.approveConfirm(
            `Are you sure want to approve document <b>${this.currentDoc.documentNo}</b>?` +
                text,
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
    }

    goToDocument(id) {
        this.router.navigateByUrl(`/library/document/${id}`);
    }
}
