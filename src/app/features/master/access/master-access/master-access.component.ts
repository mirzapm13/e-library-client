import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { RolesService } from 'src/app/shared/services/role.service';
import { UsersService } from 'src/app/shared/services/users.service';

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
        private usersService: UsersService
    ) {}

    roles: any[] = [];

    ngOnInit(): void {
        this.roleService.getRoles().subscribe((item) => {
            if (item.value) this.roles = item.value;
            // console.log(item.value);
        });
        // this.usersService.getUsers().subscribe((item) => {
        //     console.log(item);
        // });
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

    goToEditAccess(id) {
        this.router.navigateByUrl(`/master-data/access/role/${id}`);
    }
}
