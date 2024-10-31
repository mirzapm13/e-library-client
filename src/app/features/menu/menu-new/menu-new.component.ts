import { Component, OnInit } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { RolesService } from '../../user/services/role.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MenuService } from 'src/app/shared/services/menus.service';

@Component({
    selector: 'app-menu-new',
    standalone: true,
    imports: [
        DropdownModule,
        InputTextModule,
        MultiSelectModule,
        ButtonModule,
        ReactiveFormsModule,
    ],
    templateUrl: './menu-new.component.html',
    styleUrl: './menu-new.component.scss',
})
export class MenuNewComponent implements OnInit {
    newMenuForm: FormGroup;

    constructor(
        private menuService: MenuService,
        private roleService: RolesService,
        private fb: FormBuilder
    ) {
        this.newMenuForm = this.fb.group({
            parent: [],
            name: [''],
            email: [''],
            password: [''],
            description: [''],
            path: [''],
            icon: [''],
            order: [''],
            status: [false],
            role: [[]],
        });
    }

    menus: any;
    parent: any;
    roles: any;

    ngOnInit(): void {
        this.menuService.getMenus().subscribe((item) => {
            this.menus = item;
            this.parent = this.menus
                .filter((menu) => menu.parent == null)
                .map((menu) => {
                    return { label: menu.name, value: menu };
                });
        });

        this.roleService.getRoles().subscribe((item) => {
            if (item.value) {
                this.roles = item.value.map((role) => {
                    return { label: role.nama, value: role };
                });
            } else this.roles = [];
        });
    }

    onSubmit() {
        console.log(this.newMenuForm.value);
        this.menuService.addMenu(this.newMenuForm.value).subscribe((item) => {
            console.log('item.value');
        });
    }
}
