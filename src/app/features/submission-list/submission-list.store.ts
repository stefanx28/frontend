import { computed, inject, Injectable, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { CreateSubmissionDTO, Submission, UpdateSubmissionDTO } from '../../models/submission.model';
import { SubmissionService } from '../../services/submission.service';

@Injectable({ providedIn: 'root' })
export class SubmissionListStore {
  private readonly submissionService = inject(SubmissionService);
  private readonly pendingRequests = signal(0);

  readonly submissions = signal<Submission[]>([]);
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
    this.submissionService
      .getAll()
      .pipe(finalize(() => this.endRequest()))
      .subscribe({
        next: (data) => this.submissions.set(data),
        error: (err) => this.handleError(err),
      });
  }

  loadByProblem(problemId: string): void {
    this.beginRequest();
    this.submissionService
      .getByProblemId(problemId)
      .pipe(finalize(() => this.endRequest()))
      .subscribe({
        next: (data) => this.submissions.set(data),
        error: (err) => this.handleError(err),
      });
  }

  create(dto: CreateSubmissionDTO): void {
    this.beginRequest();
    this.submissionService
      .create(dto)
      .pipe(finalize(() => this.endRequest()))
      .subscribe({
        next: (created) => this.submissions.update((list) => [...list, created]),
        error: (err) => this.handleError(err),
      });
  }

  update(id: string, dto: UpdateSubmissionDTO): void {
    this.beginRequest();
    this.submissionService
      .update(id, dto)
      .pipe(finalize(() => this.endRequest()))
      .subscribe({
        next: (updated) =>
          this.submissions.update((list) =>
            list.map((s) => (s.id === updated.id ? updated : s)),
          ),
        error: (err) => this.handleError(err),
      });
  }

  remove(id: string): void {
    this.beginRequest();
    this.submissionService
      .delete(id)
      .pipe(finalize(() => this.endRequest()))
      .subscribe({
        next: () =>
          this.submissions.update((list) => list.filter((s) => s.id !== id)),
        error: (err) => this.handleError(err),
      });
  }
}