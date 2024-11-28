import { NgModule } from '@angular/core';
import { AuthModule, LogLevel } from 'angular-auth-oidc-client';
import { environment } from 'src/environments/environment';

@NgModule({
    imports: [
        AuthModule.forRoot({
            config: {
                authority: environment.ssoAuthority,
                redirectUrl: environment.ssoRedirectUrl,
                postLogoutRedirectUri: environment.ssoPostLogoutRedirect,
                clientId: environment.ssoClientId,
                scope: environment.ssoScope,
                responseType: 'code',
                silentRenew: true,
                useRefreshToken: true,
                // silentRenewUrl: `${window.location.origin}/silent-renew.html`,
                logLevel: LogLevel.Debug,
            },
        }),
    ],
    exports: [AuthModule],
})
export class AuthConfigModule {}
