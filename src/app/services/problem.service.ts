import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateProblemDTO, Problem, UpdateProblemDTO } from '../models/problem.model';

const API_URL = 'http://localhost:8080/problem';

@Injectable({ providedIn: 'root' })
export class ProblemService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<Problem[]> {
    return this.http.get<Problem[]>(API_URL);
  }

  create(dto: CreateProblemDTO): Observable<Problem> {
    return this.http.post<Problem>(API_URL, dto);
  }

  update(id: string, dto: UpdateProblemDTO): Observable<Problem> {
    return this.http.put<Problem>(`${API_URL}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${API_URL}/${id}`);
  }
}