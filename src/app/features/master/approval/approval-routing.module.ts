import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                data: { breadcrumb: 'Master Approval' },
                loadComponent: () =>
                    import('./master-approval/master-approval.component').then(
                        (m) => m.MasterApprovalComponent
                    ),
            },
            {
                path: 'edit/:id',
                data: { breadcrumb: 'Edit Approval' },
                loadComponent: () =>
                    import('./edit-approval/edit-approval.component').then(
                        (m) => m.EditApprovalComponent
                    ),
            },
        ]),
    ],
    exports: [RouterModule],
})
export class ApprovalRoutingModule {}
