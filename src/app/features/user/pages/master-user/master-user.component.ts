import { Component, OnInit } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { User } from '../../models/users.model';
import { HttpRequestState } from 'src/app/shared/http-request-state';
import { UsersService } from '../../services/users.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-master-user',
    templateUrl: './master-user.component.html',
    styleUrl: './master-user.component.scss',
})
export class MasterUserComponent implements OnInit {
    constructor(private usersService: UsersService, private router: Router) {}

    item$: Observable<HttpRequestState<User[]>>;

    ngOnInit(): void {
        this.item$ = this.usersService
            .getUsers()
            .pipe(tap((item) => console.log(item.value)));
    }

    goToNewUser() {
        this.router.navigateByUrl('/user/new');
    }
}
