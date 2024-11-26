import { Injectable } from '@angular/core';
import {
    Observable,
    of,
    map,
    catchError,
    startWith,
    BehaviorSubject,
    tap,
    throwError,
} from 'rxjs';
import { HttpRequestState } from '../http-request-state';
import { User } from './users.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class UserListService {
    constructor(private readonly http: HttpClient) {}

    getUserList(): Observable<HttpRequestState<any>> {
        return this.http.get<any>(`/auth/users`).pipe(
            map((value) => ({ isLoading: false, value })),
            catchError((error) => of({ isLoading: false, error }))
            // startWith({ isLoading: true })
        );
    }
}
