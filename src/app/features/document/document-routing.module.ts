import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'document',
                data: { breadcrumb: 'Document' },
                loadComponent: () =>
                    import(
                        './pages/document-main/document-main.component'
                    ).then((m) => m.DocumentMainComponent),
            },
            {
                path: 'approval',
                data: { breadcrumb: 'Approval' },
                loadComponent: () =>
                    import(
                        './pages/document-approval/document-approval.component'
                    ).then((m) => m.DocumentApprovalComponent),
            },
            {
                path: 'upload',
                data: { breadcrumb: 'Upload' },
                loadComponent: () =>
                    import(
                        './pages/document-upload/document-upload.component'
                    ).then((m) => m.DocumentUploadComponent),
            },
            {
                path: 'document/:id',
                data: { breadcrumb: 'Document Details' },
                loadComponent: () =>
                    import(
                        './pages/document-details/document-details.component'
                    ).then((m) => m.DocumentDetailsComponent),
            },
            {
                path: 'approval/:id',
                data: { breadcrumb: 'Detail Approval' },
                loadComponent: () =>
                    import(
                        './pages/document-approval-details/document-approval-details.component'
                    ).then((m) => m.DocumentApprovalDetailsComponent),
            },
        ]),
    ],
    exports: [RouterModule],
})
export class DocumentRoutingModule {}
