import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                data: { breadcrumb: 'Manajemen Role' },
                loadComponent: () =>
                    import('./master-role/master-role.component').then(
                        (m) => m.MasterRoleComponent
                    ),
            },
            {
                path: 'new',
                data: { breadcrumb: 'New Role' },
                loadComponent: () =>
                    import('./new-role/new-role.component').then(
                        (m) => m.NewRoleComponent
                    ),
            },
        ]),
    ],
    exports: [RouterModule],
})
export class RoleRoutingModule {}
