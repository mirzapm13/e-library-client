import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, map, tap } from 'rxjs';

const bookmarks = [
    {
        name: 'Nomor Surat',
        id: '1',
        categoryId: '1',
        url: 'https://file-examples.com/storage/fe00d37cde6728af4966ebc/2017/10/file-sample_150kB.pdf',
        expired: '20-06-2024',
        status: 'waiting',
        parents: 'Perizinan > Cuti',
        tags: ['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4'],
        short_desc: 'Lorem ipsum odor amet',
        long_desc:
            'Lorem ipsum odor amet, consectetuer adipiscing elit. In ultrices varius mi vivamus torquent, vivamus euismod accumsan. Nascetur facilisis augue sem justo duis gravida. Senectus mauris venenatis malesuada, nibh ipsum enim eros ut. Euismod class mi vivamus taciti lectus. Ipsum consectetur elementum massa adipiscing curabitur natoque per fames. Sapien netus augue porttitor bibendum odio, bibendum porta fusce.',
    },
    {
        name: 'Document 2',
        id: '2',
        categoryId: '2',
        url: 'https://file-examples.com/storage/fe00d37cde6728af4966ebc/2017/10/file-example_PDF_500_kB.pdf',
        expired: '20-06-2024',
        status: 'approved',
        parents: 'Perizinan > Cuti',
        tags: ['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4'],
        short_desc: 'Lorem ipsum odor amet',
        long_desc:
            'Lorem ipsum odor amet, consectetuer adipiscing elit. Natoque in dignissim donec morbi ornare sociosqu. Consequat dapibus sodales dignissim luctus porttitor venenatis nunc. Magna hac duis leo posuere condimentum, imperdiet ad orci.',
    },
    {
        name: 'Document 3',
        id: '3',
        categoryId: '3',
        url: 'https://file-examples.com/storage/fe00d37cde6728af4966ebc/2017/10/file-sample_150kB.pdf',
        expired: '15-06-2024',
        status: 'waiting',
        parents: 'Perizinan > Cuti',
        tags: ['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4'],
        short_desc: 'Lorem ipsum odor amet',
        long_desc:
            'Lorem ipsum odor amet, consectetuer adipiscing elit. Potenti vestibulum dapibus eleifend tellus metus, convallis nunc.',
    },
    {
        name: 'Document 4',
        id: '4',
        categoryId: '4',
        url: 'https://file-examples.com/storage/fe00d37cde6728af4966ebc/2017/10/file-example_PDF_1MB.pdf',
        expired: '15-06-2024',
        status: 'approved',
        parents: 'Perizinan > Cuti',
        tags: ['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4'],
        short_desc: 'Lorem ipsum odor amet',
        long_desc:
            'Lorem ipsum odor amet, consectetuer adipiscing elit. Felis mi commodo massa netus ullamcorper ornare. Porta primis nostra dapibus, orci ridiculus hac. Sem nec parturient, auctor fames quis metus curabitur libero. Nullam tortor ultrices primis et adipiscing sapien elementum.',
    },
    {
        name: 'Document 5',
        id: '5',
        categoryId: '5',
        url: 'https://file-examples.com/storage/fe00d37cde6728af4966ebc/2017/10/file-example_PDF_1MB.pdf',
        expired: '25-06-2024',
        status: 'waiting',
        parents: 'Perizinan > Cuti',
        tags: ['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4'],
        short_desc: 'Lorem ipsum odor amet',
        long_desc: 'Lorem ipsum odor amet, consectetuer adipiscing elit.',
    },
];

@Injectable({
    providedIn: 'root',
})
export class BookmarkService {
    constructor(private readonly http: HttpClient) {}

    getBookmarks(): Observable<any> {
        return of(bookmarks);
        return this.http.get<any>('/bookmarks');
    }

    // getDocument(id): Observable<any> {
    //     return this.http.get<any>(`/bookmark/${id}`);
    // }
}
