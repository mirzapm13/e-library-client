import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { of, switchMap } from 'rxjs';

@Component({
    templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
    rememberMe: boolean = false;

    constructor(
        private layoutService: LayoutService,
        private oidcSecurityService: OidcSecurityService
    ) {}

    public loading: boolean = false;

    ngOnInit(): void {
        // this.loading = true;
        // this.oidcSecurityService
        //     .checkAuth()
        //     .pipe(
        //         switchMap((auth) => {
        //             if (auth.isAuthenticated) {
        //                 return this.oidcSecurityService.logoffAndRevokeTokens(
        //                     null,
        //                     {
        //                         customParams: { id_token_hint: auth.idToken },
        //                     }
        //                 );
        //             } else {
        //                 return of(auth);
        //             }
        //         })
        //     )
        //     .subscribe(
        //         () => {
        //             this.loading = false;
        //         },
        //         (error) => {
        //             this.loading = false;
        //             console.error('Error occurred:', error);
        //         }
        //     );
    }

    get dark(): boolean {
        return this.layoutService.config().colorScheme !== 'light';
    }

    login() {
        this.loading = true;
        this.oidcSecurityService.authorize(null, {
            redirectUrl: 'http://localhost:4200/',
        });
    }
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
//         this.idToken = idToken;
//         console.log(isAuthenticated);
//     }
// );

// if (this.isAuthenticated) {
//     this.oidcSecurityService
//         .logoff(null, {
//             customParams: { id_token_hint: this.idToken },
//         })
//         .subscribe();
// }
