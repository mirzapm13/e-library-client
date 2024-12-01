import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import {
    ReactiveFormsModule,
    FormGroup,
    FormBuilder,
    Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { TreeSelectModule } from 'primeng/treeselect';
import { IconService } from 'src/app/demo/service/icon.service';
import { MenuService } from 'src/app/shared/services/menus.service';
import { NotifyService } from 'src/app/shared/services/notify.service';
import { RolesService } from 'src/app/shared/services/role.service';
import { groupByParent } from 'src/app/shared/utils/group-by-parent';
import { recursiveMap } from 'src/app/shared/utils/recursive-map';

@Component({
    selector: 'app-menu-edit',
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
    templateUrl: './menu-edit.component.html',
    styleUrl: './menu-edit.component.scss',
})
export class MenuEditComponent {
    editMenuForm: FormGroup;

    constructor(
        private menuService: MenuService,
        private fb: FormBuilder,
        private location: Location,
        private iconService: IconService,
        private route: ActivatedRoute,
        private notify: NotifyService,
        private roleService: RolesService
    ) {
        this.editMenuForm = this.fb.group({
            name: ['', Validators.required],
            path: ['', Validators.required],
            icon: ['', Validators.required],
            parent_id: [null],
            order: ['', Validators.required],
            status: [true, Validators.required],
            permissions: [[]],
            // description: [''],
        });
    }

    parent: any;
    roles: any;

    icons: any[] = [];

    filteredIcons: any[] = [];

    selectedIcon: any;

    menus = [];
    menuOptions = [];
    id: string;
    defaultParent;
    permissionOptions = [];

    loading = false;

    ngOnInit(): void {
        this.loading = true;

        this.id = this.route.snapshot.paramMap.get('id');

        this.menuService.getMenus().subscribe(({ isLoading, error, value }) => {
            if (error) return;
            this.menus = value.data.map((item) => ({
                ...item,
                label: item.name,
                key: item.id,
                parent_id: item.parent_id,
            }));

            this.menuOptions = groupByParent(
                this.menus,
                'children',
                'parent_id'
            );

            this.menuService
                .getMenuById(this.id)
                .subscribe(({ isLoading, error, value }) => {
                    if (error) return;

                    // console.log(value.data);

                    this.defaultParent = this.menus.filter((item) => {
                        return item.id == value.data.parentId;
                    })[0];

                    let patchData = {
                        ...value.data,
                        parent_id: this.defaultParent,
                    };

                    this.roleService
                        .getPermissions()
                        .subscribe(({ error, value }) => {
                            if (error) return;
                            this.permissionOptions = value.data;

                            this.editMenuForm.patchValue(patchData);
                            this.loading = false;
                        });
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
        this.loading = true;
        let payload = this.editMenuForm.value;
        payload = { ...payload, parent_id: payload.parent_id?.id };

        if (!this.editMenuForm.valid) {
            this.loading = false;
            this.showAllValidationErrors(this.editMenuForm);
            return;
        }
        // return;
        this.menuService
            .editMenu(this.id, payload)
            .subscribe(({ isLoading, error, value }) => {
                if (error) {
                    this.notify.alert('error', error.message);
                    this.loading = false;
                    return;
                }

                this.notify.alert('success', value.message);
                this.loading = false;
            });
    }

    clickBack() {
        this.location.back();
    }

    private showAllValidationErrors(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach((field) => {
            const control = formGroup.get(field);
            if (control) {
                control.markAsTouched({ onlySelf: true });
            }
        });
    }
}
