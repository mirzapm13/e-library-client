import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    BehaviorSubject,
    catchError,
    Observable,
    of,
    switchMap,
    tap,
} from 'rxjs';

export type ICategoryState = any;

@Injectable({
    providedIn: 'root',
})
export class CategoryService {
    constructor(private readonly http: HttpClient) {}

    private categoryState = new BehaviorSubject<any | undefined>(undefined);

    state$: Observable<ICategoryState | undefined> =
        this.categoryState.asObservable();

    getCategories(): Observable<ICategoryState> {
        return this.state$.pipe(
            switchMap((state) => {
                if (state) {
                    // If state exists, return it as an Observable
                    return of(state);
                } else {
                    // Otherwise, fetch the state from the server
                    return this.fetchData().pipe(
                        tap((fetchedData) =>
                            this.categoryState.next(fetchedData)
                        )
                    );
                }
            })
        );
    }

    private fetchData(): Observable<ICategoryState> {
        return this.http.get<ICategoryState>('/category').pipe(
            catchError((error) => {
                console.error('Error fetching data', error);
                return of({ data: null }); // Return an empty state in case of error
            })
        );
    }
}
