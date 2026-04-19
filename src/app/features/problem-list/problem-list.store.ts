import { computed, inject, Injectable, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { CreateProblemDTO, Problem, UpdateProblemDTO } from '../../models/problem.model'; // Verify path
import { ProblemService } from '../../services/problem.service';

@Injectable({ providedIn: 'root' })
export class ProblemListStore {
  private readonly problemService = inject(ProblemService);
  private readonly pendingRequests = signal(0);

  readonly problems = signal<Problem[]>([]);
  readonly hasError = signal(false);
  

  readonly errorMessage = signal<string | null>(null);
  
  readonly isLoading = computed(() => this.pendingRequests() > 0);

  private beginRequest(): void {
    
    this.hasError.set(false);
    this.errorMessage.set(null);
    this.pendingRequests.update((count) => count + 1);
  }

  private endRequest(): void {
    this.pendingRequests.update((count) => Math.max(0, count - 1));
  }

  
  private handleError(err: any): void {
    this.hasError.set(true);
   
    const message = err?.error?.message || err?.message || 'An unexpected error occurred';
    this.errorMessage.set(message);
  }

  load(): void {
    this.beginRequest();
    this.problemService
      .getAll()
      .pipe(finalize(() => this.endRequest()))
      .subscribe({
        next: (data) => this.problems.set(data),
        error: (err) => this.handleError(err),
      });
  }

  create(dto: CreateProblemDTO): void {
    this.beginRequest();
    this.problemService
      .create(dto)
      .pipe(finalize(() => this.endRequest()))
      .subscribe({
        next: (created) => this.problems.update((list) => [...list, created]),
        error: (err) => this.handleError(err),
      });
  }

  update(id: string, dto: UpdateProblemDTO): void {
    this.beginRequest();
    this.problemService
      .update(id, dto)
      .pipe(finalize(() => this.endRequest()))
      .subscribe({
        next: (updated) =>
          this.problems.update((list) =>
            list.map((p) => (p.id === updated.id ? updated : p)),
          ),
        error: (err) => this.handleError(err),
      });
  }

  remove(id: string): void {
    this.beginRequest();
    this.problemService
      .delete(id)
      .pipe(finalize(() => this.endRequest()))
      .subscribe({
        next: () =>
          this.problems.update((list) => list.filter((p) => p.id !== id)),
        error: (err) => this.handleError(err),
      });
  }
}