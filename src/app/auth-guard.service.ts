import { Injectable } from '@angular/core';
import { CanActivateChild, Router } from '@angular/router';
import { UserService } from './core/auth/services/user.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivateChild {
    constructor(private router: Router, private userService: UserService) {}

    canActivateChild() {
        // const isLoggedIn = !!localStorage.getItem('authToken');
        // if (!isLoggedIn) {
        //     this.router.navigate(['/auth/login']);
        //     return false;
        // }
        return true;
    }
}
