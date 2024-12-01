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
import { SafeResourceUrl } from '@angular/platform-browser';
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
export class DocumentDetailsComponent implements OnDestroy {
    constructor(
        private documentService: DocumentService,
        private route: ActivatedRoute,
        private router: Router,
        private location: Location,
        private confirmService: ConfirmService,
        private notify: NotifyService,
        private userService: UserService,
        private categoryService: CategoryService
    ) {
        this.route.params.subscribe((item) => {
            this.detailLoading = true;
            this.docLoading = true;

            this.id = this.route.snapshot.paramMap.get('id');

            this.currentUser = this.userService.getUserData();

            this.documentService
                .getDocumentById(this.id)
                .subscribe(({ error, value }) => {
                    if (error) {
                        this.notify.alert('error', error.message);
                        this.docLoading = false;
                    }

                    this.currentDoc = value.data;

                    let payload = { filename: value.data.filename };

                    // if (
                    //     value.data?.approvers.some(
                    //         (item) => item.email == this.currentUser.user.email
                    //     )
                    // ) {
                    //     this.currentApprove = true;
                    // }

                    value.data?.approvers?.forEach((item, idx) => {
                        if (
                            item.email == this.currentUser.user.email &&
                            item.status == 'waiting'
                        ) {
                            if (
                                value.data?.approvers[idx - 1]?.status ==
                                'waiting'
                            ) {
                                return;
                            }

                            this.currentApprove = true;
                        }
                    });

                    this.references = value.data.reference;
                    this.categoryApprover = value.data.category?.users;

                    this.detailLoading = false;

                    // this.categoryService
                    //     .getCategoryById(this.currentDoc.categoryId)
                    //     .subscribe(({ error, value }) => {
                    //         if (error) return;

                    //         this.categoryApprover = value.data.users;
                    //         this.detailLoading = false;
                    //     });

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
        });
    }

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

    isBookmarked = false;
    bookmarkLoading = false;

    //==== dummy references

    references = [];

    // ngOnInit(): void {}

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
                color: rgb(0.5, 0.5, 0.5),
                opacity: 0.3,
            });

            page.drawText(
                `At ${this.currentDateTime.toLocaleDateString('id-ID')}`,
                {
                    x: page.getWidth() / 2 - dateWidth / 2,
                    y: page.getHeight() / 2 - textHeight / 2,
                    size: textSize,
                    font: helveticaFont,
                    color: rgb(0.5, 0.5, 0.5),
                    opacity: 0.3,
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
                    color: rgb(0.5, 0.5, 0.5),
                    opacity: 0.3,
                    // rotate: degrees(-60),
                }
            );
        });

        // Serialize the PDFDocument to bytes (a Uint8Array)
        const pdfBytes = await pdfDoc.save();

        // this.pdfUrl = pdfBytes;

        // Trigger the browser to download the PDF document
        download(pdfBytes, this.currentDoc.documentNo, 'application/pdf');
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
            `Are you sure want to <b class="text-green-500">approve</b> document <b>${this.currentDoc.documentNo}</b>?` +
                text,
            () => this.approveCallback(this.id)
        );
    }

    rejectDocument() {
        this.confirmService.approveConfirm(
            `Are you sure want to <b class="text-red-500">reject</b> document <b>${this.currentDoc.documentNo}</b>?`,
            () => this.rejectCallback(this.id)
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
                this.location.back();

                // this.documentService
                //     .getDocumentById(id)
                //     .subscribe(({ error, value }) => {
                //         if (error) {
                //             this.notify.alert('error', error.message);
                //             this.detailLoading = false;
                //             return;
                //         }
                //         this.currentDoc = value.data;

                //         this.detailLoading = false;
                //     });
            });
    }

    rejectCallback(id) {
        this.detailLoading = true;

        this.documentService
            .approveDocument(id, { status: 'rejected' })
            .subscribe(({ error, value }) => {
                if (error) {
                    this.notify.alert('error', error.message);
                    this.detailLoading = false;
                    return;
                }

                this.notify.alert('success', value.message);

                this.location.back();

                // this.documentService
                //     .getDocumentById(id)
                //     .subscribe(({ error, value }) => {
                //         if (error) {
                //             this.notify.alert('error', error.message);
                //             this.detailLoading = false;
                //             return;
                //         }
                //         this.currentDoc = value.data;
                //         this.detailLoading = false;
                //     });
            });
    }

    goToDocument(id) {
        this.router.navigateByUrl(`/library/document/${id}`);
    }

    bookmarkDocument(id) {
        let payload = { is_bookmark: 'true' };

        if (this.isBookmarked) payload.is_bookmark = 'false';

        this.bookmarkLoading = true;

        this.documentService
            .bookmarkDocument(id, payload)
            .subscribe(({ error, value }) => {
                if (error) {
                    this.notify.alert('error', error.message);
                    this.bookmarkLoading = false;
                }

                this.notify.alert('success', value.message);

                this.bookmarkLoading = false;
            });
    }
}
