import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                loadComponent: () =>
                    import('./menu-main/menu-main.component').then(
                        (m) => m.MenuMainComponent
                    ),
            },
            {
                path: 'new',
                loadComponent: () =>
                    import('./menu-new/menu-new.component').then(
                        (m) => m.MenuNewComponent
                    ),
            },
        ]),
    ],
    exports: [RouterModule],
})
export class MenuRoutingModule {}
