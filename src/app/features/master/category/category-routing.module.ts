import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                data: { breadcrumb: 'Manajemen Category' },
                loadComponent: () =>
                    import('./master-category/master-category.component').then(
                        (m) => m.MasterCategoryComponent
                    ),
            },
            {
                path: 'new',
                data: { breadcrumb: 'New Category' },
                loadComponent: () =>
                    import('./new-category/new-category.component').then(
                        (m) => m.NewCategoryComponent
                    ),
            },
        ]),
    ],
    exports: [RouterModule],
})
export class CategoryRoutingModule {}
