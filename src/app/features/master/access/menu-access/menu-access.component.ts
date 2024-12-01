import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TreeTableModule } from 'primeng/treetable';
import { MenuService } from 'src/app/shared/services/menus.service';
import { NotifyService } from 'src/app/shared/services/notify.service';
import { RolesService } from 'src/app/shared/services/role.service';
import { groupByParent } from 'src/app/shared/utils/group-by-parent';

@Component({
    selector: 'app-menu-access',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        TreeTableModule,
        FormsModule,
        InputTextModule,
    ],
    templateUrl: './menu-access.component.html',
    styleUrl: './menu-access.component.scss',
})
export class MenuAccessComponent implements OnInit {
    id;
    selectedNodes = [];
    menus = [];
    menuOptions = [];
    cols = [
        { field: 'label', header: 'Menu' },
        { field: 'access', header: 'Access' },
    ];

    roleName;

    constructor(
        private menuService: MenuService,
        private route: ActivatedRoute,
        private router: Router,
        private roleService: RolesService,
        private notify: NotifyService,
        private location: Location
    ) {}

    loading = false;
    ngOnInit(): void {
        this.loading = true;
        this.id = this.route.snapshot.paramMap.get('id');

        this.menuService
            .getMenuByRoleId(this.id)
            .subscribe(({ error, value }) => {
                this.menus = value.data;
                this.menuOptions = groupByParent(this.menus, 'children');

                // console.log(this.menuOptions);

                this.roleService
                    .getRoleById(this.id)
                    .subscribe(({ isLoading, error, value }) => {
                        if (error) return;
                        this.roleName = value.data.name;
                        this.loading = false;
                    });
            });
    }

    clickBack() {
        this.router.navigateByUrl('/master-data/access');
    }

    showNodes() {
        console.log(this.selectedNodes);
    }

    activeItems = [];

    onSubmit() {
        // const checkboxes = document.querySelectorAll(
        //     'input[type="checkbox"][name="menu-access"]:checked'
        // );
        // const values = Array.from(checkboxes).map(
        //     (checkbox: HTMLInputElement) => checkbox.value
        // );

        this.loading = true;

        this.processLoop(this.menuOptions);

        let payload = {
            role_id: this.id,
            menus: this.activeItems,
        };

        this.activeItems = [];
        this.roleService
            .assignRoleMenu(payload)
            .subscribe(({ error, value }) => {
                if (error) {
                    this.notify.alert('error', error.message);
                    this.loading = false;
                    return;
                }

                this.notify.alert('success', value.message);
                this.loading = false;
                this.location.back();
            });
    }

    processItem(item) {
        if (item.active) {
            let menu = {
                id: item.id,
                permissions: item.permissions
                    .filter((perm) => perm.active)
                    .map((perm) => perm.name),
            };

            this.activeItems.push(menu);

            if (item.children) this.processLoop(item.children);
        }
    }

    processLoop(data) {
        data.forEach((item) => this.processItem(item));
    }
}
