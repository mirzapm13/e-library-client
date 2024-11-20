import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpRequestState } from '../http-request-state';

const documents = [
    {
        name: 'Nomor Surat',
        id: '1',
        categoryId: '1',
        url: 'https://file-examples.com/storage/fef4e75e176737761a179bf/2017/10/file-example_PDF_500_kB.pdf',
        expired: '20-06-2024',
        status: 'waiting',
        parents: 'Perizinan > Cuti',
        tags: ['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4'],
        short_desc: 'Lorem ipsum odor amet',
        long_desc:
            'Lorem ipsum odor amet, consectetuer adipiscing elit. In ultrices varius mi vivamus torquent; vivamus euismod accumsan. Nascetur facilisis augue sem justo duis gravida. Senectus mauris venenatis malesuada; nibh ipsum enim eros ut. Euismod class mi vivamus taciti lectus. Ipsum consectetur elementum massa adipiscing curabitur natoque per fames. Sapien netus augue porttitor bibendum odio; bibendum porta fusce.',
    },
    {
        name: 'Document 2',
        id: '2',
        categoryId: '2',
        url: 'https://file-examples.com/storage/fef4e75e176737761a179bf/2017/10/file-example_PDF_500_kB.pdf',
        expired: '20-06-2024',
        status: 'approved',
        parents: 'Perizinan > Cuti',
        tags: ['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4'],
        short_desc: 'Lorem ipsum odor amet',
        long_desc:
            'Lorem ipsum odor amet, consectetuer adipiscing elit. Natoque in dignissim donec morbi ornare sociosqu. Consequat dapibus sodales dignissim luctus porttitor venenatis nunc. Magna hac duis leo posuere condimentum; imperdiet ad orci.',
    },
    {
        name: 'Document 3',
        id: '3',
        categoryId: '3',
        url: 'https://file-examples.com/storage/fef4e75e176737761a179bf/2017/10/file-example_PDF_500_kB.pdf',
        expired: '15-06-2024',
        status: 'waiting',
        parents: 'Perizinan > Cuti',
        tags: ['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4'],
        short_desc: 'Lorem ipsum odor amet',
        long_desc:
            'Lorem ipsum odor amet, consectetuer adipiscing elit. Potenti vestibulum dapibus eleifend tellus metus; convallis nunc.',
    },
    {
        name: 'Document 4',
        id: '4',
        categoryId: '4',
        url: 'https://file-examples.com/storage/fef4e75e176737761a179bf/2017/10/file-example_PDF_500_kB.pdf',
        expired: '15-06-2024',
        status: 'approved',
        parents: 'Perizinan > Cuti',
        tags: ['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4'],
        short_desc: 'Lorem ipsum odor amet',
        long_desc:
            'Lorem ipsum odor amet, consectetuer adipiscing elit. Felis mi commodo massa netus ullamcorper ornare. Porta primis nostra dapibus, orci ridiculus hac. Sem nec parturient; auctor fames quis metus curabitur libero. Nullam tortor ultrices primis et adipiscing sapien elementum.',
    },
    {
        name: 'Document 5',
        id: '5',
        categoryId: '5',
        url: 'https://file-examples.com/storage/fef4e75e176737761a179bf/2017/10/file-example_PDF_500_kB.pdf',
        expired: '25-06-2024',
        status: 'waiting',
        parents: 'Perizinan > Cuti',
        tags: ['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4'],
        short_desc: 'Lorem ipsum odor amet',
        long_desc: 'Lorem ipsum odor amet, consectetuer adipiscing elit.',
    },
    {
        name: 'Document 6',
        id: '6',
        categoryId: '6',
        url: 'https://file-examples.com/storage/fef4e75e176737761a179bf/2017/10/file-example_PDF_500_kB.pdf',
        expired: '30-06-2024',
        status: 'waiting',
        parents: 'Perizinan > Cuti',
        tags: ['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4'],
        short_desc: 'Lorem ipsum odor amet',
        long_desc:
            'Lorem ipsum odor amet, consectetuer adipiscing elit. Varius magnis condimentum senectus lectus leo ligula. Ornare duis vehicula orci facilisi mollis in sollicitudin, et pharetra.',
    },
];

@Injectable({
    providedIn: 'root',
})
export class DocumentService {
    constructor(private readonly http: HttpClient) {}

    getDocuments(): Observable<HttpRequestState<any>> {
        return this.http.get<any>('/documents').pipe(
            map((value) => ({ isLoading: false, value })),
            catchError((error) => of({ isLoading: false, error }))
            // startWith({ isLoading: true })
        );
    }

    getDocumentById(id): Observable<HttpRequestState<any>> {
        return this.http.get<any>(`/documents/${id}`).pipe(
            map((value) => ({ isLoading: false, value })),
            catchError((error) => of({ isLoading: false, error }))
            // startWith({ isLoading: true })
        );
    }

    getDocument(id): Observable<any> {
        return of(documents[id]);
        return this.http.get<any>(`/documents/${id}`);
    }

    uploadFile(formData): Observable<HttpRequestState<any>> {
        return this.http.post<any>('/storage/upload', formData).pipe(
            map((value) => ({ isLoading: false, value })),
            catchError((error) => of({ isLoading: false, error }))
            // startWith({ isLoading: true })
        );
    }

    downloadFile(payload) {
        return this.http.post('/storage/download', payload, {
            responseType: 'blob',
        });
        // .pipe(
        //     map((value) => ({ isLoading: false, value })),
        //     catchError((error) => of({ isLoading: false, error }))
        //     // startWith({ isLoading: true })
        // );
    }

    addDocument(payload): Observable<HttpRequestState<any>> {
        return this.http.post<any>('/documents', payload).pipe(
            map((value) => ({ isLoading: false, value })),
            catchError((error) => of({ isLoading: false, error }))
            // startWith({ isLoading: true })
        );
    }
}
