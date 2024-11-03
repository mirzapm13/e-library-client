import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { JwtService } from '../auth/services/jwt.service';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Data } from '@angular/router';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
    let token;

    inject(OidcSecurityService)
        .getAccessToken()
        .subscribe((data) => (token = data));

    const request = req.clone({
        setHeaders: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });
    return next(request);
};
