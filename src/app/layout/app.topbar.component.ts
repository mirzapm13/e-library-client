import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AppSidebarComponent } from './app.sidebar.component';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { switchMap } from 'rxjs';
import { UserService } from '../core/auth/services/user.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
})
export class AppTopbarComponent implements OnInit {
    @ViewChild('menubutton') menuButton!: ElementRef;
    @ViewChild(AppSidebarComponent) appSidebar!: AppSidebarComponent;
    activeItem!: number;
    constructor(
        public layoutService: LayoutService,
        public el: ElementRef,
        private oidcSecurityService: OidcSecurityService,
        private userService: UserService,
        private router: Router
    ) {}

    currentUser;

    ngOnInit(): void {
        this.currentUser = this.userService.getUserData();
    }

    onMenuButtonClick() {
        this.layoutService.onMenuToggle();
    }

    onSidebarButtonClick() {
        this.layoutService.showSidebar();
    }

    onConfigButtonClick() {
        this.layoutService.showConfigSidebar();
    }

    logout() {
        this.oidcSecurityService
            .checkAuth()
            .pipe(
                switchMap((auth) => {
                    return this.oidcSecurityService.logoffAndRevokeTokens();
                })
            )
            .subscribe((auth) => {
                // this.router.navigateByUrl('/auth/login');
            });
    }
}
