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
        ]),
    ],
    exports: [RouterModule],
})
export class ApprovalRoutingModule {}
