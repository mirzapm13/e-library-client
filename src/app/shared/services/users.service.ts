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

const user = {
    isLoading: false,
    value: [
        {
            nama: 'Admin',
            jabatan: 'System Admin',
            email: 'admin@galeri24.co.id',
            status: false,
            id: '1df5',
            description: 'Description of this user',
        },
        {
            nama: 'Direksi',
            jabatan: 'Direksi',
            email: 'direksi@galeri24.co.id',
            status: true,
            id: '09cc',
            description: 'Description of this user',
        },
        {
            id: '5503',
            nama: 'Mrza',
            email: 'mirzamail@mail.com',
            password: 'testpass',
            nik: '123',
            jabatan: '1',
            department: '2',
            status: true,
            description: 'Description of this user',
            role: [
                {
                    label: 'Admin',
                    value: '1',
                },
                {
                    label: 'Direksi',
                    value: '2',
                },
            ],
        },
    ],
};

@Injectable({
    providedIn: 'root',
})
export class UsersService {
    constructor(private readonly http: HttpClient) {}

    getUsers(): Observable<HttpRequestState<User[]>> {
        return of(user);
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
