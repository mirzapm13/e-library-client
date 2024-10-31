import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError, of, startWith } from 'rxjs';
import { HttpRequestState } from 'src/app/shared/http-request-state';

export interface IRole {
    nama: string;
    id: number;
}

@Injectable({
    providedIn: 'root',
})
export class RolesService {
    constructor(private readonly http: HttpClient) {}

    getRoles(): Observable<HttpRequestState<IRole[]>> {
        return this.http.get<IRole[]>(`/role`).pipe(
            map((value) => ({ isLoading: false, value })),
            catchError((error) => of({ isLoading: false, error })),
            startWith({ isLoading: true })
        );
    }
}
