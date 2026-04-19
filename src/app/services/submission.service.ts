import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateSubmissionDTO, Submission, UpdateSubmissionDTO } from '../models/submission.model';


const API_URL = 'http://localhost:8080/submission'; 

@Injectable({ providedIn: 'root' })
export class SubmissionService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<Submission[]> {
    return this.http.get<Submission[]>(API_URL);
  }


  getByProblemId(problemId: string): Observable<Submission[]> {
    return this.http.get<Submission[]>(`${API_URL}/problem/${problemId}`);
  }


  create(dto: CreateSubmissionDTO): Observable<Submission> {
    return this.http.post<Submission>(API_URL, dto);
  }


  update(id: string, dto: UpdateSubmissionDTO): Observable<Submission> {
    return this.http.put<Submission>(`${API_URL}/${id}`, dto);
  }


  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${API_URL}/${id}`);
  }
}