import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'access',
                data: { breadcrumb: 'Access Management' },
                loadChildren: () =>
                    import('./access/access.module').then(
                        (m) => m.AccessModule
                    ),
            },
            {
                path: 'menu',
                data: { breadcrumb: 'Menu Management' },
                loadChildren: () =>
                    import('./menu/menu.module').then((m) => m.MenuModule),
            },
            {
                path: 'category',
                data: { breadcrumb: 'Category Management' },
                loadChildren: () =>
                    import('./category/category.module').then(
                        (m) => m.CategoryModule
                    ),
            },
            {
                path: 'approval',
                data: { breadcrumb: 'Approval Management' },
                loadChildren: () =>
                    import('./approval/approval.module').then(
                        (m) => m.ApprovalModule
                    ),
            },
        ]),
    ],
    exports: [RouterModule],
})
export class MasterRoutingModule {}
