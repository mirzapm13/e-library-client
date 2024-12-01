import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { map } from 'rxjs';
import { UserService } from 'src/app/core/auth/services/user.service';
import { CategoryService } from 'src/app/shared/services/category.service';
import { ConfirmService } from 'src/app/shared/services/confirmation.service';
import { NotifyService } from 'src/app/shared/services/notify.service';
import { addParentName } from 'src/app/shared/utils/add-parent-name';

@Component({
    selector: 'app-master-category',
    standalone: true,
    imports: [CommonModule, ButtonModule, TableModule, InputTextModule],
    templateUrl: './master-category.component.html',
    styleUrl: './master-category.component.scss',
})
export class MasterCategoryComponent implements OnInit {
    constructor(
        private router: Router,
        private categoryService: CategoryService,
        private confirmService: ConfirmService,
        private notify: NotifyService,
        private userService: UserService
    ) {}

    categories: any[];

    loading = false;

    userPermissions;

    @ViewChild('dt2') dt2!: Table;

    ngOnInit(): void {
        this.loading = true;

        this.categoryService.getCategories().subscribe(({ error, value }) => {
            if (error) {
                this.notify.alert('error', error.message);
                this.loading = false;
                return;
            }
            this.categories = value.data;
            // console.log(this.categories);
            this.loading = false;
        });

        this.userPermissions = this.userService.getUserData().permissions;
    }

    goToNewCategory() {
        this.router.navigateByUrl('/master-data/category/new');
    }

    goToEditCategory(id) {
        this.router.navigateByUrl(`/master-data/category/edit/${id}`);
    }

    goToApprovers(id) {
        this.router.navigateByUrl(`/master-data/category/approval/${id}`);
    }

    joinParents(item) {
        return item.map((item) => item.name).join(' > ');
    }

    deleteCallback(id) {
        this.loading = true;

        this.categoryService
            .deleteCategory(id)
            .subscribe(({ error, value }) => {
                if (error) {
                    this.notify.alert('error', error.message);
                    this.loading = false;
                    return;
                }

                this.notify.alert('success', value.message);

                this.categoryService
                    .getCategories()
                    .subscribe(({ error, value }) => {
                        if (error) {
                            this.notify.alert('error', error.message);
                            this.loading = false;
                            return;
                        }
                        this.categories = value.data;
                        this.loading = false;
                    });
            });
    }

    deleteCategory(id, name) {
        this.confirmService.deleteConfirm(
            `Are you sure want to delete <b>${name}</b>?`,
            () => this.deleteCallback(id)
        );
    }

    onGlobalFilterEvent(event: Event) {
        const input = event.target as HTMLInputElement;

        if (this.dt2) {
            this.dt2.filterGlobal(input.value, 'contains');
        }
    }
}
