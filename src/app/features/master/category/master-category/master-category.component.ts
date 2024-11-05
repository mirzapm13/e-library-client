import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

    ngOnInit(): void {
        this.categoryService
            .getCategories()
            .pipe(map((data) => addParentName(data)))
            .subscribe((data) => {
                this.categories = data;
            });
    }

    goToNewCategory() {
        this.router.navigateByUrl('/master-data/category/new');
    }
}
