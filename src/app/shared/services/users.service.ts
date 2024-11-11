import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, startWith } from 'rxjs';
import { HttpRequestState } from 'src/app/shared/http-request-state';

export interface User {
    nama: string;
    email: string;
    status: boolean;
    id: string;
}

@Injectable({
    providedIn: 'root',
})
export class UsersService {
    constructor(private readonly http: HttpClient) {}

    getUsers(): Observable<HttpRequestState<User[]>> {
        return this.http.get<User[]>(`/user`).pipe(
            map((value) => ({ isLoading: false, value })),
            catchError((error) => of({ isLoading: false, error })),
            startWith({ isLoading: true })
        );
    }

    addUser(data): Observable<HttpRequestState<any>> {
        return this.http.post('/user', data).pipe(
            map((value) => ({ isLoading: false, value })),
            catchError((error) => of({ isLoading: false, error })),
            startWith({ isLoading: true })
        );
    }
}
