import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { JwtService } from 'src/app/core/auth/services/jwt.service';

@Component({
    templateUrl: './login.component.html',
    // standalone: true,
})
export class LoginComponent implements OnInit {
    rememberMe: boolean = false;

    constructor(
        private layoutService: LayoutService,
        private oidcSecurityService: OidcSecurityService,
        private readonly jwtService: JwtService
    ) {}

    idToken: string;
    isAuthenticated: boolean;

    ngOnInit(): void {
        this.oidcSecurityService
            .checkAuth()
            .subscribe(
                ({
                    isAuthenticated,
                    userData,
                    accessToken,
                    idToken,
                    configId,
                }) => {
                    this.isAuthenticated = isAuthenticated;
                    this.idToken = idToken;
                    console.log(isAuthenticated);
                }
            );

        if (this.isAuthenticated) {
            this.oidcSecurityService
                .logoff(null, {
                    customParams: { id_token_hint: this.idToken },
                })
                .subscribe();
        }
    }

    get dark(): boolean {
        return this.layoutService.config().colorScheme !== 'light';
    }

    login() {
        this.oidcSecurityService.authorize();
    }
}
