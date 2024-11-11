import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class BookmarkService {
    constructor(private readonly http: HttpClient) {}

    getBookmarks(): Observable<any> {
        return this.http.get<any>('/bookmarks');
    }

    // getDocument(id): Observable<any> {
    //     return this.http.get<any>(`/bookmark/${id}`);
    // }
}
