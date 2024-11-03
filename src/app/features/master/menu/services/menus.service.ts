import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpRequestState } from 'src/app/shared/http-request-state';

@Injectable({
    providedIn: 'root',
})
export class MenuService {
    constructor(private readonly http: HttpClient) {}

    getMenus(): Observable<any> {
        return this.http.get('/menus').pipe();
    }
}
