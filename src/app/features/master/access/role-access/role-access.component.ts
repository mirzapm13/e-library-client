import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { RolesService } from 'src/app/shared/services/role.service';

@Component({
    selector: 'app-role-access',
    standalone: true,
    imports: [
        ButtonModule,
        ReactiveFormsModule,
        CommonModule,
        InputTextModule,
        DropdownModule,
    ],
    templateUrl: './role-access.component.html',
    styleUrl: './role-access.component.scss',
})
export class RoleAccessComponent implements OnInit {
    roleAccessForm: FormGroup;

    roleOptions: any = [];

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private roleService: RolesService
    ) {
        this.roleAccessForm = this.fb.group({
            nama: [],
            description: [],
            role: [],
            status: [],
        });
    }

    ngOnInit(): void {
        this.roleService.getRoles().subscribe((data) => {
            if (data.value) {
                this.roleOptions = data.value.map((data) => {
                    return { label: data.nama, value: data };
                });
            }
        });
    }

    clickBack() {
        this.router.navigateByUrl('/master-data/access');
    }
}
