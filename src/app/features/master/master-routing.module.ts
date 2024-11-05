import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'role',
                data: { breadcrumb: 'Manajemen Role' },
                loadChildren: () =>
                    import('./role/role.module').then((m) => m.RoleModule),
            },
            {
                path: 'menu',
                data: { breadcrumb: 'Manajemen Menu' },
                loadChildren: () =>
                    import('./menu/menu.module').then((m) => m.MenuModule),
            },
            {
                path: 'category',
                data: { breadcrumb: 'Manajemen Category' },
                loadChildren: () =>
                    import('./category/category.module').then(
                        (m) => m.CategoryModule
                    ),
            },
        ]),
    ],
    exports: [RouterModule],
})
export class MasterRoutingModule {}
