import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { UserService } from 'src/app/core/auth/services/user.service';
import { RolesService } from 'src/app/shared/services/role.service';
import { User, UsersService } from 'src/app/shared/services/users.service';

@Component({
    selector: 'app-master-role',
    standalone: true,
    imports: [CommonModule, ButtonModule, TableModule, InputTextModule],
    templateUrl: './master-access.component.html',
    styleUrl: './master-access.component.scss',
})
export class MasterAccessComponent implements OnInit {
    constructor(
        private roleService: RolesService,
        private router: Router,
        private userService: UserService
    ) {}

    roles: any[] = [];

    loading = true;

    userPermissions;

    @ViewChild('dt2') dt2!: Table;

    ngOnInit(): void {
        this.roleService.getRoles().subscribe(({ isLoading, error, value }) => {
            this.roles = value.data;

            this.loading = false;
        });

        this.userPermissions = this.userService.getUserData().permissions;
    }

    goToNewRole() {
        this.router.navigateByUrl('/master-data/access/new');
    }

    trackByFunction = (_index, item) => {
        return item.id; // O index
    };

    goToMenuAccess(id) {
        this.router.navigateByUrl(`/master-data/access/menu/${id}`);
    }

    goToCategoryAccess(id) {
        this.router.navigateByUrl(`/master-data/access/category/${id}`);
    }

    goToEditAccess(id) {
        this.router.navigateByUrl(`/master-data/access/edit/${id}`);
    }

    onGlobalFilterEvent(event: Event) {
        const input = event.target as HTMLInputElement;

        if (this.dt2) {
            this.dt2.filterGlobal(input.value, 'contains');
        }
    }
}
