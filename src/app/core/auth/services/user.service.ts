import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    BehaviorSubject,
    catchError,
    map,
    Observable,
    tap,
    throwError,
} from 'rxjs';
import { HttpRequestState } from 'src/app/shared/http-request-state';

@Injectable({ providedIn: 'root' })
export class UserService {
    private userDataSubject = new BehaviorSubject<any>(null);

    userData$ = this.userDataSubject.asObservable();

    constructor(private readonly http: HttpClient) {}

    getUserData() {
        return this.userDataSubject.value;
    }

    setUserData(userData) {
        this.userDataSubject.next(userData);
    }

    fetchUserData(): Observable<HttpRequestState<any>> {
        return this.http.post<any>(`/auth/callback`, {}).pipe(
            tap((data: any) => this.userDataSubject.next(data?.data)),
            map((value) => ({ isLoading: false, value })),
            // catchError((error) => of({ isLoading: false, error })),
            catchError((err) => {
                return throwError(err);
            })
        );
    }
}
