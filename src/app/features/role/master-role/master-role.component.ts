import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { RolesService } from 'src/app/shared/services/role.service';

@Component({
    selector: 'app-master-role',
    standalone: true,
    imports: [CommonModule, ButtonModule, TableModule],
    templateUrl: './master-role.component.html',
    styleUrl: './master-role.component.scss',
})
export class MasterRoleComponent implements OnInit {
    constructor(private roleService: RolesService, private router: Router) {}

    roles: any[] = [];

    ngOnInit(): void {
        this.roleService.getRoles().subscribe((item) => {
            if (item.value) this.roles = item.value;
            console.log(item.value);
        });
    }

    goToNewRole() {
        this.router.navigateByUrl('/master-data/role/new');
    }

    trackByFunction = (_index, item) => {
        return item.id; // O index
    };
}
