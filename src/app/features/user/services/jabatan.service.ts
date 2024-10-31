import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError, of, startWith } from 'rxjs';
import { HttpRequestState } from 'src/app/shared/http-request-state';

export interface IJabatan {
  nama: string;
  id:number;
}

@Injectable({
  providedIn: 'root'
})
export class JabatanService {

  constructor(private readonly http: HttpClient) { }
  
  getJabatans() : Observable <HttpRequestState<IJabatan[]>> {
    return this.http.get<IJabatan[]>(`/jabatan`).pipe(
      map((value) => ({isLoading: false, value})),
      catchError(error => of({isLoading: false, error})),
      startWith({isLoading: true}),
    )
  }
  
}
