import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MenuService } from 'src/app/shared/services/menus.service';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormsModule } from '@angular/forms';
import { addParentName } from 'src/app/shared/utils/add-parent-name';

@Component({
    selector: 'app-menu-main',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        ButtonModule,
        InputSwitchModule,
        FormsModule,
    ],
    templateUrl: './menu-main.component.html',
    styleUrl: './menu-main.component.scss',
})
export class MenuMainComponent implements OnInit {
    constructor(private menusService: MenuService, private router: Router) {}

    menus: any;

    test: any;

    ngOnInit(): void {
        this.menusService.getMenuMaster().subscribe((item) => {
            const mapped = addParentName(item);
            this.menus = mapped.map((item) => {
                return {
                    nama: item.name,
                    path: item.path,
                    parent: item.parentName,
                    order: item.order,
                    icon: item.icon,
                    status: item.status,
                    parentId: item.parentId,
                };
            });
        });
    }

    goToNewMenu(): void {
        this.router.navigateByUrl('/master-data/menu/new');
    }

    trackByFunction = (_index, item) => {
        return item.id; // O index
    };
}
