import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MenuService } from 'src/app/shared/services/menus.service';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormsModule } from '@angular/forms';
import { NotifyService } from 'src/app/shared/services/notify.service';
import { ConfirmationService } from 'primeng/api';
import { ConfirmService } from 'src/app/shared/services/confirmation.service';
import { UserService } from 'src/app/core/auth/services/user.service';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'app-menu-main',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        ButtonModule,
        InputSwitchModule,
        FormsModule,
        InputTextModule,
    ],
    templateUrl: './menu-main.component.html',
    styleUrl: './menu-main.component.scss',
})
export class MenuMainComponent implements OnInit {
    constructor(
        private menusService: MenuService,
        private router: Router,
        private notify: NotifyService,
        private confirmService: ConfirmService,
        private userService: UserService
    ) {}

    userPermissions;

    menus: any = [];

    loading = false;

    @ViewChild('dt2') dt2!: Table;

    ngOnInit(): void {
        this.loading = true;

        this.menusService.getMenus().subscribe(({ error, value }) => {
            if (error) {
                this.notify.alert('error', error.message);
                this.loading = false;
                return;
            }
            this.menus = value.data;

            this.loading = false;
        });

        this.userPermissions = this.userService.getUserData().permissions;
    }

    goToNewMenu(): void {
        this.router.navigateByUrl('/master-data/menu/new');
    }
    goToEditMenu(id): void {
        this.router.navigateByUrl(`/master-data/menu/edit/${id}`);
    }

    trackByFunction = (_index, item) => {
        return item.id; // O index
    };

    joinParents(item) {
        return item.map((item) => item.name).join(' > ');
    }

    deleteCallback(id) {
        this.loading = true;

        this.menusService.deleteMenu(id).subscribe(({ error, value }) => {
            if (error) {
                this.notify.alert('error', error.message);
                this.loading = false;
                return;
            }

            this.notify.alert('success', value.message);

            this.menusService.getMenus().subscribe(({ error, value }) => {
                if (error) {
                    this.notify.alert('error', error.message);
                    this.loading = false;
                    return;
                }
                this.menus = value.data;
                this.loading = false;
            });
        });
    }

    deleteMenu(id, name) {
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
