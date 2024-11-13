import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MenuService } from 'src/app/shared/services/menus.service';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormsModule } from '@angular/forms';

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

    menus: any = [];

    ngOnInit(): void {
        this.menusService
            .getMenus()
            .subscribe(({ isLoading, error, value }) => {
                if (error) return;
                if (!value) return;
                this.menus = value.data;
            });
    }

    goToNewMenu(): void {
        this.router.navigateByUrl('/master-data/menu/new');
    }
    goToEditMenu(id): void {
        this.router.navigateByUrl(`/master-data/menu/edit/${id}`);
    }

    trackByFunction = (_index, item) => {
        return item.id; // O index
    };
}
