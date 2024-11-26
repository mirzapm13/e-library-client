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
                path: 'menu/:id',
                data: { breadcrumb: 'Access Menu' },
                loadComponent: () =>
                    import('./menu-access/menu-access.component').then(
                        (m) => m.MenuAccessComponent
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
            {
                path: 'edit/:id',
                data: { breadcrumb: 'Edit Access' },
                loadComponent: () =>
                    import('./edit-access/edit-access.component').then(
                        (m) => m.EditAccessComponent
                    ),
            },
        ]),
    ],
    exports: [RouterModule],
})
export class AccessRoutingModule {}
