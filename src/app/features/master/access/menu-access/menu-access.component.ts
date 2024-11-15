import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TreeTableModule } from 'primeng/treetable';
import { MenuService } from 'src/app/shared/services/menus.service';
import { NotifyService } from 'src/app/shared/services/notify.service';
import { RolesService } from 'src/app/shared/services/role.service';
import { groupByParent } from 'src/app/shared/utils/group-by-parent';

@Component({
    selector: 'app-menu-access',
    standalone: true,
    imports: [CommonModule, ButtonModule, TreeTableModule],
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

    constructor(
        private menuService: MenuService,
        private route: ActivatedRoute,
        private router: Router,
        private roleService: RolesService,
        private notify: NotifyService
    ) {}

    loading = false;
    ngOnInit(): void {
        this.loading = true;
        this.id = this.route.snapshot.paramMap.get('id');

        this.menuService
            .getMenuByRoleId(this.id)
            .subscribe(({ error, value }) => {
                console.log(value.data);

                this.menus = value.data.map((item) => ({
                    ...item,
                    key: item.id,
                    data: item,
                    expanded: true,
                }));

                this.menuOptions = groupByParent(this.menus, 'children');

                this.selectedNodes = value.data
                    .filter((item) => item.active)
                    .map((item) => ({
                        ...item,
                        key: item.id,
                        data: item,
                    }));
                this.loading = false;
            });
    }

    clickBack() {
        this.router.navigateByUrl('/master-data/access');
    }

    showNodes() {
        console.log(this.selectedNodes);
    }

    onSubmit() {
        let mappedNodes = this.selectedNodes.map((item) => item.id);

        let payload = {
            role_id: this.id,
            menu_ids: mappedNodes,
        };

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
            });
    }
}
