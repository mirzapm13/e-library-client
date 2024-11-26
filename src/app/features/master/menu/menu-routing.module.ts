import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                data: { breadcrumb: 'Manajemen Menu' },
                loadComponent: () =>
                    import('./menu-main/menu-main.component').then(
                        (m) => m.MenuMainComponent
                    ),
            },
            {
                path: 'new',
                data: { breadcrumb: 'New Menu' },
                loadComponent: () =>
                    import('./menu-new/menu-new.component').then(
                        (m) => m.MenuNewComponent
                    ),
            },
            {
                path: 'edit/:id',
                data: { breadcrumb: 'Edit Menu' },
                loadComponent: () =>
                    import('./menu-edit/menu-edit.component').then(
                        (m) => m.MenuEditComponent
                    ),
            },
        ]),
    ],
    exports: [RouterModule],
})
export class MenuRoutingModule {}
