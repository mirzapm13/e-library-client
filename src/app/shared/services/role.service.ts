import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError, of, startWith } from 'rxjs';
import { HttpRequestState } from 'src/app/shared/http-request-state';

export interface IRole {
    nama: string;
    id: number;
}

const role = {
    value: [
        {
            nama: 'Admin',
            description: 'Description of admin',
            id: 1,
            status: true,
        },
        {
            nama: 'Contributor',
            description: 'Description of contributor',
            id: 2,
            status: true,
        },
        {
            nama: 'Approver',
            description: 'Description of approver',
            id: 3,
            status: true,
        },
    ],
    isLoading: false,
};

@Injectable({
    providedIn: 'root',
})
export class RolesService {
    constructor(private readonly http: HttpClient) {}

    getRoles(): Observable<HttpRequestState<IRole[]>> {
        return of(role);
        return this.http.get<IRole[]>(`/role`).pipe(
            map((value) => ({ isLoading: false, value })),
            catchError((error) => of({ isLoading: false, error })),
            startWith({ isLoading: true })
        );
    }
}
