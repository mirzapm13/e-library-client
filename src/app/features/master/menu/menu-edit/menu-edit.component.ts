import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import {
    ReactiveFormsModule,
    FormGroup,
    FormBuilder,
    Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { TreeSelectModule } from 'primeng/treeselect';
import { IconService } from 'src/app/demo/service/icon.service';
import { MenuService } from 'src/app/shared/services/menus.service';
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
        private route: ActivatedRoute
    ) {
        this.editMenuForm = this.fb.group({
            name: ['', Validators.required],
            path: ['', Validators.required],
            icon: ['', Validators.required],
            parent_id: [null],
            order: ['', Validators.required],
            status: [true, Validators.required],
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
    defaultMenu;

    loading = false;

    ngOnInit(): void {
        this.loading = true;

        this.id = this.route.snapshot.paramMap.get('id');

        this.menuService.getMenus().subscribe(({ isLoading, error, value }) => {
            if (isLoading) return;
            if (error) return;
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

        this.menuService
            .getMenuById(this.id)
            .subscribe(({ isLoading, error, value }) => {
                if (error) return;
                if (isLoading) return;

                this.defaultMenu = this.menus.filter((item) => {
                    return item.id == value.data.parentId;
                })[0];

                let patchData = {
                    ...value.data,
                    parent_id: this.defaultMenu,
                };
                this.editMenuForm.patchValue(patchData);
                this.loading = false;
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
            console.log('not valid');
            return;
        }
        // return;
        this.menuService
            .editMenu(this.id, payload)
            .subscribe(({ isLoading, error, value }) => {
                console.log(value.message);
                this.loading = false;
            });
    }

    clickBack() {
        this.location.back();
    }
}
