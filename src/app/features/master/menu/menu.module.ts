import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MenuRoutingModule } from './menu-routing.module';

@NgModule({
    imports: [
        CommonModule,
        // FormsModule,
        // ChartModule,
        // MenuModule,
        // TableModule,
        // StyleClassModule,
        // PanelMenuModule,
        ButtonModule,
        MenuRoutingModule,
    ],
})
export class MenuModule {}
