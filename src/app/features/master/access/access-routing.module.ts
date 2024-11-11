import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                data: { breadcrumb: 'Access Management' },
                loadComponent: () =>
                    import('./master-access/master-access.component').then(
                        (m) => m.MasterAccessComponent
                    ),
            },
            {
                path: 'new',
                data: { breadcrumb: 'New Access' },
                loadComponent: () =>
                    import('./new-access/new-access.component').then(
                        (m) => m.NewAccessComponent
                    ),
            },
            {
                path: 'category/:id',
                data: { breadcrumb: 'Access Category' },
                loadComponent: () =>
                    import('./category-access/category-access.component').then(
                        (m) => m.CategoryAccessComponent
                    ),
            },
            {
                path: 'role/:id',
                data: { breadcrumb: 'Role Management' },
                loadComponent: () =>
                    import('./role-access/role-access.component').then(
                        (m) => m.RoleAccessComponent
                    ),
            },
        ]),
    ],
    exports: [RouterModule],
})
export class AccessRoutingModule {}
