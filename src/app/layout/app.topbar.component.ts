import { Component, ElementRef, ViewChild } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AppSidebarComponent } from './app.sidebar.component';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { switchMap } from 'rxjs';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
})
export class AppTopbarComponent {
    @ViewChild('menubutton') menuButton!: ElementRef;
    @ViewChild(AppSidebarComponent) appSidebar!: AppSidebarComponent;
    activeItem!: number;
    constructor(
        public layoutService: LayoutService,
        public el: ElementRef,
        private oidcSecurityService: OidcSecurityService
    ) {}

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
                    return this.oidcSecurityService.logoffAndRevokeTokens(
                        null,
                        {
                            customParams: { id_token_hint: auth.idToken },
                        }
                    );
                })
            )
            .subscribe();
    }
}
