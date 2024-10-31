import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError, of, startWith } from 'rxjs';
import { HttpRequestState } from 'src/app/shared/http-request-state';

export interface IDepartment {
  nama: string;
  id:number;
}

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(private readonly http: HttpClient) { }
  
  getDepartments() : Observable <HttpRequestState<IDepartment[]>> {
    return this.http.get<IDepartment[]>(`/department`).pipe(
      map((value) => ({isLoading: false, value})),
      catchError(error => of({isLoading: false, error})),
      startWith({isLoading: true}),
    )
  }
  
}
