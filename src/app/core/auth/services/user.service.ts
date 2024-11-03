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

    fetchUserData(): Observable<any> {
        return this.http.get<any>(`/user-data`).pipe(
            tap((data: any) => this.userDataSubject.next(data)),
            catchError((err) => {
                return throwError(err);
            })
        );
    }
}
