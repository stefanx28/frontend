// services/submission.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { CreateSubmissionDto, Submission } from '../models/submission.model';

const API_URL = 'http://localhost:8080/submission';

@Injectable({ providedIn: 'root' })
export class SubmissionService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<Submission[]> {
    return this.http.get<Submission[]>(API_URL).pipe(
      catchError(this.handleError)
    );
  }

  create(dto: CreateSubmissionDto): Observable<Submission> {
    return this.http.post<Submission>(API_URL, dto).pipe(
      catchError(this.handleError)
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${API_URL}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const message = error.error?.message ?? 'An unexpected error occurred';
    return throwError(() => message);
  }
}