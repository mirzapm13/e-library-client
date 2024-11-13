import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { UserService } from './core/auth/services/user.service';
import { catchError, map, of, switchMap, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private oidcSecurityService: OidcSecurityService,
        private userService: UserService
    ) {}

    isAuthenticated;
    userData;

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.oidcSecurityService.checkAuth().pipe(
            switchMap((auth) => {
                console.log(auth.accessToken);
                if (auth.isAuthenticated) {
                    return of(true);
                    // return this.userService.fetchUserData().pipe(
                    //     map(() => true),
                    //     catchError((err) => {
                    //         console.error(err);
                    //         this.router.navigateByUrl('/auth/login');
                    //         return of(false);
                    //     })
                    // );
                } else {
                    this.router.navigateByUrl('/auth/login');
                    return of(false);
                }
            })
        );

        // return true;
    }

    // canActivateChild(route: ActivatedRouteSnapshot) {
    //     this.oidcSecurityService
    //         .checkAuth()
    //         .subscribe(
    //             ({
    //                 isAuthenticated,
    //                 userData,
    //                 accessToken,
    //                 idToken,
    //                 configId,
    //             }) => {
    //                 this.isAuthenticated = isAuthenticated;
    //                 console.log(userData);
    //             }
    //         );

    //     if (!this.isAuthenticated) {
    //         this.router.navigate(['/auth/login']);
    //         return false;
    //     }

    //     return true;
    // }
}

// .subscribe(
//     ({
//         isAuthenticated,
//         userData,
//         accessToken,
//         idToken,
//         configId,
//     }) => {
//         this.isAuthenticated = isAuthenticated;
//     }
// );

// if (!this.isAuthenticated) {
//     this.router.navigate(['/auth/login']);
//     return false;
// }
