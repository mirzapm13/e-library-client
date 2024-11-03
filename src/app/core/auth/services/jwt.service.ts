import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class JwtService {
    getToken(): string {
        return window.localStorage['access_token'];
    }

    saveToken(token: string): void {
        window.localStorage['access_token'] = token;
    }

    destroyToken(): void {
        window.localStorage.removeItem('access_token');
    }
}
