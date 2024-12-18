import { Component, OnInit } from '@angular/core';
import { AppConfig, LayoutService } from './layout/service/app.layout.service';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
    constructor(private layoutService: LayoutService) {}

    ngOnInit(): void {
        const config: AppConfig = {
            ripple: true, // toggles ripple on and off
            inputStyle: 'outlined', // default style for input elements, can be "outlined" or "filled"
            menuMode: 'static', // layout mode of the menu, valid values are "static", "overlay", "slim", "slim_plus", "horizontal", "reveal" and "drawer"
            colorScheme: 'light', // color scheme of the template, valid values are "light" and "dark"
            theme: 'galeri24-alt', // default component theme for PrimeNG
            menuTheme: 'light', // theme of the menu, valid values are "light" and "dark"
            topbarTheme: 'light', // theme of the topbar, valid values are "light" and "dark"
            scale: 16, // size of the body font size to scale the whole application
        };

        this.layoutService.config.set(config);
    }
}
