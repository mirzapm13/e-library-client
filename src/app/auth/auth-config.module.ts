import { NgModule } from '@angular/core';
import { AuthModule, LogLevel } from 'angular-auth-oidc-client';

@NgModule({
    imports: [
        AuthModule.forRoot({
            config: {
                authority: 'https://lemur-17.cloud-iam.com/auth/realms/sso-dev',
                redirectUrl: 'http://localhost:4200/',
                postLogoutRedirectUri: 'http://localhost:4200/',
                clientId: 'g24-library-front',
                scope: 'openid profile offline_access',
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
