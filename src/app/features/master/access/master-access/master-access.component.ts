import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { UserService } from 'src/app/core/auth/services/user.service';
import { RolesService } from 'src/app/shared/services/role.service';
import { User, UsersService } from 'src/app/shared/services/users.service';

@Component({
    selector: 'app-master-role',
    standalone: true,
    imports: [CommonModule, ButtonModule, TableModule],
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
}
