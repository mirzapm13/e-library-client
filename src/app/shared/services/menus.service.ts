import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, startWith } from 'rxjs';
import { HttpRequestState } from 'src/app/shared/http-request-state';

@Injectable({
    providedIn: 'root',
})
export class MenuService {
    constructor(private readonly http: HttpClient) {}

    getMenus(): Observable<any> {
        return this.http.get('/menus').pipe();
    }

    getMenuMaster(): Observable<any> {
        return this.http.get('/menu-settings').pipe();
    }

    addMenu(data): Observable<HttpRequestState<any>> {
        return this.http.post('/menu-settings', data).pipe(
            map((value) => ({ isLoading: false, value })),
            catchError((error) => of({ isLoading: false, error })),
            startWith({ isLoading: true })
        );
    }
}
