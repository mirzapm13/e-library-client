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
                data: { breadcrumb: 'Manajemen Role' },
                loadChildren: () =>
                    import('./menu/menu.module').then((m) => m.MenuModule),
            },
        ]),
    ],
    exports: [RouterModule],
})
export class MasterRoutingModule {}
