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
import { IconService } from 'src/app/demo/service/icon.service';
import { groupByParent } from 'src/app/shared/utils/group-by-parent';
import { recursiveMap } from 'src/app/shared/utils/recursive-map';
import { TreeSelectModule } from 'primeng/treeselect';
import { ChipsModule } from 'primeng/chips';
import { NotifyService } from 'src/app/shared/services/notify.service';
import { Router } from '@angular/router';
import { RolesService } from 'src/app/shared/services/role.service';

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
        ChipsModule,
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
        private iconService: IconService,
        private notify: NotifyService,
        private router: Router
    ) {
        this.newMenuForm = this.fb.group({
            name: ['', Validators.required],
            path: ['', Validators.required],
            icon: ['', Validators.required],
            parent_id: [null],
            order: ['', Validators.required],
            status: [true, Validators.required],
            description: [''],
            permissions: [[]],
        });
    }

    parent: any;
    icons: any[] = [];
    filteredIcons: any[] = [];
    selectedIcon: any;
    menuOptions;
    menus = [];
    permissionOptions = [];

    loading = false;
    ngOnInit(): void {
        this.loading = true;

        this.menuService.getMenus().subscribe(({ isLoading, error, value }) => {
            if (error) return;
            if (isLoading) return;

            this.menus = value.data.map((item) => ({
                ...item,
                parent_id: item.parent_id,
                label: item.name,
                key: item.id,
            }));

            this.menuOptions = groupByParent(
                this.menus,
                'children',
                'parent_id'
            );

            this.roleService.getPermissions().subscribe(({ error, value }) => {
                if (error) return;
                this.permissionOptions = value.data;
                this.loading = false;
            });
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

    onSubmit() {
        if (!this.newMenuForm.valid) {
            this.notify.alert('error', 'Check the required fields');
            return;
        }

        let payload = this.newMenuForm.value;
        payload = { ...payload, parent_id: payload?.parent_id.id };

        this.menuService
            .addMenu(payload)
            .subscribe(({ isLoading, error, value }) => {
                this.loading = true;
                if (error) {
                    this.notify.alert('error', error.message);
                    this.loading = false;
                    return;
                }

                this.notify.alert('success', value.message);
                this.router.navigateByUrl('/master-data/menu');
                this.loading = false;
            });
    }

    clickBack() {
        this.location.back();
    }
}
