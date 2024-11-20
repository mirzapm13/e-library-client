import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    catchError,
    map,
    Observable,
    of,
    startWith,
    tap,
    throwError,
} from 'rxjs';
import { HttpRequestState } from 'src/app/shared/http-request-state';

const menus = [
    {
        id: 1,
        name: 'Homepage',
        path: '/',
        order: '1',
        icon: 'pi pi-fw pi-home',
        status: 1,
        parentId: null,
    },
    {
        id: '2',
        name: 'Library',
        path: '/library',
        order: 2,
        icon: 'pi pi-fw pi-book',
        status: 1,
        parentId: null,
    },
    {
        id: '3',
        name: 'Dokumen',
        path: '/library/dokumen',
        order: 1,
        icon: 'pi pi-fw pi-file-o',
        status: 1,
        parentId: '2',
    },
    {
        id: '4',
        name: 'Approval Dokumen',
        path: '/library/approval',
        order: 2,
        icon: 'pi pi-fw pi-verified',
        status: 1,
        parentId: '2',
    },
    {
        id: '5',
        name: 'Master Data',
        path: '/master-data',
        order: 3,
        icon: 'pi pi-fw pi-cog',
        status: 1,
        parentId: null,
    },
    {
        id: '6',
        name: 'Manajemen Menu',
        path: '/master-data/menu',
        order: 1,
        icon: 'pi pi-fw pi-list',
        status: 1,
        parentId: '5',
    },
    {
        id: '7',
        name: 'Manajemen Akses',
        path: '/master-data/access',
        order: 2,
        icon: 'pi pi-fw pi-sign-in',
        status: 1,
        parentId: '5',
    },
    {
        id: '8',
        name: 'Manajemen Category',
        path: '/master-data/category',
        order: 3,
        icon: 'pi pi-fw pi-sitemap',
        status: 1,
        parentId: '5',
    },
    {
        id: '9',
        name: 'Manajemen Approval',
        path: '/master-data/approval',
        order: 4,
        icon: 'pi pi-fw pi-users',
        status: 1,
        parentId: '5',
    },
];

@Injectable({
    providedIn: 'root',
})
export class MenuService {
    constructor(private readonly http: HttpClient) {}

    getMenus(): Observable<HttpRequestState<any>> {
        return this.http.get<any>('/menus').pipe(
            map((value) => ({ isLoading: false, value })),
            catchError((error) => of({ isLoading: false, error }))
            // startWith({ isLoading: true })
        );
    }

    getMenuByCurrentRole(): Observable<HttpRequestState<any>> {
        return this.http.get<any>('/menus/role-menu').pipe(
            map((value) => ({ isLoading: false, value })),
            catchError((error) => of({ isLoading: false, error }))
            // startWith({ isLoading: true })
        );
    }

    getMenuById(id): Observable<HttpRequestState<any>> {
        return this.http.get<any>(`/menus/${id}`).pipe(
            map((value) => ({ isLoading: false, value })),
            catchError((error) => of({ isLoading: false, error }))
            // startWith({ isLoading: true })
        );
    }

    addMenu(data): Observable<HttpRequestState<any>> {
        return this.http.post<any>('/menusasda', data).pipe(
            map((value) => ({ isLoading: false, value })),
            catchError((error) => of({ isLoading: false, error }))
            // startWith({ isLoading: true })
        );
    }

    editMenu(id, data): Observable<HttpRequestState<any>> {
        return this.http.put<any>(`/menus/${id}`, data).pipe(
            map((value) => ({ isLoading: false, value })),
            catchError((error) => of({ isLoading: false, error }))
            // startWith({ isLoading: true })
        );
    }

    getMenuByRoleId(id): Observable<HttpRequestState<any>> {
        return this.http.get<any>(`/menus/role-menu/${id}`).pipe(
            map((value) => ({ isLoading: false, value })),
            catchError((error) => of({ isLoading: false, error }))
            // startWith({ isLoading: true })
        );
    }

    deleteMenu(id): Observable<HttpRequestState<any>> {
        return this.http.delete<any>(`/menus/${id}`).pipe(
            map((value) => ({ isLoading: false, value })),
            catchError((error) => of({ isLoading: false, error }))
            // startWith({ isLoading: true })
        );
    }

    getMenuMaster(): Observable<any> {
        return of(menus);
        return this.http.get('/menu-settings').pipe();
    }
}
