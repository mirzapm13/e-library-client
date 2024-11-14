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
            {
                path: 'edit/:id',
                data: { breadcrumb: 'Edit Category' },
                loadComponent: () =>
                    import('./edit-category/edit-category.component').then(
                        (m) => m.EditCategoryComponent
                    ),
            },
        ]),
    ],
    exports: [RouterModule],
})
export class CategoryRoutingModule {}
