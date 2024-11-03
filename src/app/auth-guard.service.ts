import { Injectable } from '@angular/core';
import {
    ActivatedRoute,
    ActivatedRouteSnapshot,
    CanActivateChild,
    Router,
} from '@angular/router';
import { AuthService } from './core/auth/services/auth.service';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { JwtService } from './core/auth/services/jwt.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivateChild {
    constructor(
        private router: Router,
        private jwtService: JwtService,
        private oidcSecurityService: OidcSecurityService,
        private activatedRoute: ActivatedRoute
    ) {}

    isAuthenticated;

    canActivateChild(route: ActivatedRouteSnapshot) {
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
                    console.log(userData);
                }
            );

        if (!this.isAuthenticated) {
            this.router.navigate(['/auth/login']);
            return false;
        }

        return true;
    }
}
