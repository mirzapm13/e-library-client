import { Component, OnInit } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MenuService } from 'src/app/shared/services/menus.service';
import { CommonModule, Location } from '@angular/common';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RolesService } from 'src/app/shared/services/role.service';
import { IconService } from 'src/app/demo/service/icon.service';
import { groupByParent } from 'src/app/shared/utils/group-by-parent';
import { recursiveMap } from 'src/app/shared/utils/recursive-map';
import { TreeSelectModule } from 'primeng/treeselect';

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
        TreeSelectModule,
    ],
    templateUrl: './menu-new.component.html',
    styleUrl: './menu-new.component.scss',
})
export class MenuNewComponent implements OnInit {
    newMenuForm: FormGroup;
    menu: any = {};

    constructor(
        private menuService: MenuService,
        private roleService: RolesService,
        private fb: FormBuilder,
        private location: Location,
        private iconService: IconService
    ) {
        this.newMenuForm = this.fb.group({
            name: ['', Validators.required],
            path: ['', Validators.required],
            icon: ['', Validators.required],
            parent_id: [null],
            order: ['', Validators.required],
            status: [true, Validators.required],

            description: [''],
        });
    }

    parent: any;
    roles: any;

    icons: any[] = [];

    filteredIcons: any[] = [];

    selectedIcon: any;

    menuOptions;
    menus = [];

    ngOnInit(): void {
        this.menuService.getMenus().subscribe(({ isLoading, error, value }) => {
            if (error) return;
            if (isLoading) return;
            // this.parent = value.data.map((item) => ({
            //     label: item.name,
            //     value: item.id,
            // }));

            this.menus = value.data.map((item) => ({
                ...item,
                label: item.name,
                key: item.id,
            }));

            this.menuOptions = groupByParent(this.menus);
            this.menuOptions = recursiveMap(
                this.menuOptions,
                (data) => ({ ...data }),
                'children'
            );
        });

        this.iconService.getIcons().subscribe((data) => {
            data = data.filter((value) => {
                return value.icon.tags.indexOf('deprecate') === -1;
            });

            let icons = data.map((value) => {
                return {
                    label: `pi pi-${value.properties.name}`,
                    value: `pi pi-${value.properties.name}`,
                };
            });

            this.icons = icons;
        });
    }
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

    onSubmit() {
        if (!this.newMenuForm.valid) {
            console.log('not valid');
            return;
        }

        let payload = this.newMenuForm.value;
        payload = { ...payload, parent_id: payload.parent_id.id };
        console.log(payload);
        return;
        this.menuService
            .addMenu(this.newMenuForm.value)
            .subscribe(({ isLoading, error, value }) => {
                console.log(value);
            });
    }

    clickBack() {
        this.location.back();
    }
}
