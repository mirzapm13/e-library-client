import { Component, OnInit } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MenuService } from 'src/app/shared/services/menus.service';
import { CommonModule, Location } from '@angular/common';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RolesService } from 'src/app/shared/services/role.service';
import { IconService } from 'src/app/demo/service/icon.service';

@Component({
    selector: 'app-menu-new',
    standalone: true,
    imports: [
        CommonModule,
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
        private location: Location,
        private iconService: IconService
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

    icons: any[] = [];

    filteredIcons: any[] = [];

    selectedIcon: any;

    onFilter(event: Event): void {
        const searchText = (event.target as HTMLInputElement).value;

        if (!searchText) {
            this.filteredIcons = this.icons;
        } else {
            this.filteredIcons = this.icons.filter((it) => {
                return it.icon.tags[0].includes(searchText);
            });
        }
    }

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

        this.iconService.getIcons().subscribe((data) => {
            data = data.filter((value) => {
                return value.icon.tags.indexOf('deprecate') === -1;
            });

            let icons = data.map((value) => {
                return {
                    label: value.properties.name,
                    value: value.properties.name,
                };
            });
            // icons.sort((icon1, icon2) => {
            //     if (icon1.properties.name < icon2.properties.name) return -1;
            //     else if (icon1.properties.name < icon2.properties.name)
            //         return 1;
            //     else return 0;
            // });

            this.icons = icons;
            // this.filteredIcons = data;
            console.log(icons);
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
