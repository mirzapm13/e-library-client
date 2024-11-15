import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { map } from 'rxjs';
import { CategoryService } from 'src/app/shared/services/category.service';
import { addParentName } from 'src/app/shared/utils/add-parent-name';

@Component({
    selector: 'app-master-category',
    standalone: true,
    imports: [CommonModule, ButtonModule, TableModule],
    templateUrl: './master-category.component.html',
    styleUrl: './master-category.component.scss',
})
export class MasterCategoryComponent implements OnInit {
    constructor(
        private router: Router,
        private categoryService: CategoryService
    ) {}

    categories: any[];

    loading = false;

    ngOnInit(): void {
        this.loading = true;

        this.categoryService
            .getCategories()
            .subscribe(({ isLoading, error, value }) => {
                if (error) return;
                console.log(value.data);
                this.categories = value.data;
                this.loading = false;
            });
    }

    goToNewCategory() {
        this.router.navigateByUrl('/master-data/category/new');
    }

    goToEditCategory(id) {
        this.router.navigateByUrl(`/master-data/category/edit/${id}`);
    }
}
