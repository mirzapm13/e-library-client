import { Component, OnInit } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { RolesService } from '../../user/services/role.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MenuService } from 'src/app/shared/services/menus.service';
import { Location } from '@angular/common';
import { InputSwitchModule } from 'primeng/inputswitch';

@Component({
    selector: 'app-menu-new',
    standalone: true,
    imports: [
        DropdownModule,
        InputTextModule,
        MultiSelectModule,
        ButtonModule,
        ReactiveFormsModule,
        InputSwitchModule,
    ],
    templateUrl: './menu-new.component.html',
    styleUrl: './menu-new.component.scss',
})
export class MenuNewComponent implements OnInit {
    newMenuForm: FormGroup;

    constructor(
        private menuService: MenuService,
        private roleService: RolesService,
        private fb: FormBuilder,
        private location: Location
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
            status: [true],
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

    clickBack() {
        this.location.back();
    }
}
