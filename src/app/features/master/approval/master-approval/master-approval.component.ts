import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { RolesService } from 'src/app/shared/services/role.service';
import { UsersService } from 'src/app/shared/services/users.service';

@Component({
    selector: 'app-master-approval',
    standalone: true,
    imports: [CommonModule, ButtonModule, TableModule],
    templateUrl: './master-approval.component.html',
    styleUrl: './master-approval.component.scss',
})
export class MasterApprovalComponent {
    constructor(
        private roleService: RolesService,
        private router: Router,
        private usersService: UsersService
    ) {}

    roles: any[] = [];
    users: any[] = [];

    ngOnInit(): void {
        this.roleService.getRoles().subscribe((item) => {
            if (item.value) this.roles = item.value;
        });
        this.usersService.getUsers().subscribe((item) => {
            if (item.value) this.users = item.value;
        });
    }

    goToNewRole() {
        this.router.navigateByUrl('/master-data/access/new');
    }

    trackByFunction = (_index, item) => {
        return item.id; // O index
    };

    goToCategoryAccess(id) {
        this.router.navigateByUrl(`/master-data/access/category/${id}`);
    }

    goToEditApproval(id) {
        this.router.navigateByUrl(`/master-data/approval/edit/${id}`);
    }
}
