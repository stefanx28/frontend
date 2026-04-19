import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { CreatePersonDTO, Person } from '../models/person.model';

const API_URL = 'http://localhost:8080/person';

@Injectable({ providedIn: 'root' })
export class PersonService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<Person[]> {
    return this.http.get<Person[]>(API_URL).pipe(
      catchError(this.handleError)
    );
  }

  create(dto: CreatePersonDTO): Observable<Person> {
    return this.http.post<Person>(API_URL, dto).pipe(
      catchError(this.handleError)
    );
  }

  update(id: string, dto: CreatePersonDTO): Observable<Person> {
    return this.http.put<Person>(`${API_URL}/${id}`, dto).pipe(
      catchError(this.handleError)
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${API_URL}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log('Raw error:', error);
    console.log('error.error:', error.error);
    console.log('message:', error.error?.message);
    const message = error.error?.message ?? 'Unexpected error';
    return throwError(() => message);
}
}