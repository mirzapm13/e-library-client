import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    BehaviorSubject,
    catchError,
    map,
    Observable,
    of,
    startWith,
    switchMap,
    tap,
} from 'rxjs';
import { HttpRequestState } from '../http-request-state';

export type ICategoryState = any;
const category = [
    {
        id: '3',
        name: 'Komersial & Pengembangan Bisnis',
        parentId: '2',
        status: true,
    },
    { id: '4', name: 'Penjualan', parentId: '3', status: true },
    { id: '5', name: 'Pemasaran & CSR', parentId: '3', status: true },
    {
        id: '6',
        name: 'Pengembangan Bisnis & Bullion Services',
        parentId: '3',
        status: true,
    },
    { id: '7', name: 'Wholesale', parentId: '3', status: true },
    { id: '8', name: 'Pabrikasi & Refinery', parentId: '2', status: true },
    { id: '9', name: 'Produksi Perhiasan', parentId: '8', status: true },
    { id: '10', name: 'Produksi LM & Refinery', parentId: '8', status: true },
    { id: '11', name: 'Pengelolaan Bahan Baku', parentId: '8', status: true },
    { id: '12', name: 'Stok & Distribusi', parentId: '2', status: true },
    { id: '13', name: 'Stok', parentId: '12', status: true },
    { id: '14', name: 'Distribusi', parentId: '12', status: true },
    { id: '15', name: 'Pembelian', parentId: '12', status: true },
    { id: '17', name: 'TI & Bisnis Digital', parentId: '16', status: true },
    { id: '18', name: 'Operasional TI', parentId: '17', status: true },
    { id: '19', name: 'Pengembangan TI', parentId: '17', status: true },
    { id: '20', name: 'IT Security', parentId: '17', status: true },
    { id: '21', name: 'Bisnis Digital', parentId: '17', status: true },
    {
        id: '22',
        name: 'Keuangan & Perencanaan Strategis',
        parentId: '16',
        status: true,
    },
    { id: '23', name: 'Akuntansi', parentId: '22', status: true },
    { id: '24', name: 'Tresuri', parentId: '22', status: true },
    {
        id: '25',
        name: 'Perencanaan Strategis & Subsidiary',
        parentId: '22',
        status: true,
    },
    { id: '26', name: 'Umum & SDM', parentId: '16', status: true },
    { id: '27', name: 'Jaringan & Logistik', parentId: '26', status: true },
    { id: '28', name: 'SDM & Budaya Kerja', parentId: '26', status: true },
    {
        id: '29',
        name: 'Risiko, Legal & Kepatuhan',
        parentId: '26',
        status: true,
    },
];

@Injectable({
    providedIn: 'root',
})
export class CategoryService {
    constructor(private readonly http: HttpClient) {}

    getCategories(): Observable<HttpRequestState<any>> {
        return this.http.get<any>('/categories').pipe(
            map((value) => ({ isLoading: false, value })),
            catchError((error) => of({ isLoading: false, error })),
            startWith({ isLoading: true })
        );
    }

    getCategoryById(id): Observable<HttpRequestState<any>> {
        return this.http.get<any>(`/categories/${id}`).pipe(
            map((value) => ({ isLoading: false, value })),
            catchError((error) => of({ isLoading: false, error })),
            startWith({ isLoading: true })
        );
    }

    addCategory(data): Observable<HttpRequestState<any>> {
        return this.http.post<any>('/categories', data).pipe(
            map((value) => ({ isLoading: false, value })),
            catchError((error) => of({ isLoading: false, error })),
            startWith({ isLoading: true })
        );
    }

    editCategory(id, data): Observable<HttpRequestState<any>> {
        return this.http.post<any>(`/categories/${id}`, data).pipe(
            map((value) => ({ isLoading: false, value })),
            catchError((error) => of({ isLoading: false, error })),
            startWith({ isLoading: true })
        );
    }

    // private categoryState = new BehaviorSubject<any | undefined>(undefined);

    // state$: Observable<ICategoryState | undefined> =
    //     this.categoryState.asObservable();

    // getCategories(): Observable<ICategoryState> {
    //     return this.state$.pipe(
    //         switchMap((state) => {
    //             if (state) {
    //                 // If state exists, return it as an Observable
    //                 return of(state);
    //             } else {
    //                 // Otherwise, fetch the state from the server
    //                 return this.fetchData().pipe(
    //                     tap((fetchedData) =>
    //                         this.categoryState.next(fetchedData)
    //                     )
    //                 );
    //             }
    //         })
    //     );
    // }

    // private fetchData(): Observable<ICategoryState> {
    //     return of(category);
    //     return this.http.get<ICategoryState>('/category').pipe(
    //         catchError((error) => {
    //             console.error('Error fetching data', error);
    //             return of({ data: null }); // Return an empty state in case of error
    //         })
    //     );
    // }
}
