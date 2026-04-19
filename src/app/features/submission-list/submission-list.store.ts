// submission-list.store.ts
import { computed, inject, Injectable, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { CreateSubmissionDto, Submission } from '../../models/submission.model';
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
    this.pendingRequests.update(count => count + 1);
  }

  private endRequest(): void {
    this.pendingRequests.update(count => Math.max(0, count - 1));
  }

  private handleError(message: string): void {
    this.hasError.set(true);
    this.errorMessage.set(message);
  }

  private clearError(): void {
    this.hasError.set(false);
    this.errorMessage.set(null);
  }

  load(): void {
    this.clearError();
    this.beginRequest();
    this.submissionService
      .getAll()
      .pipe(finalize(() => this.endRequest()))
      .subscribe({
        next: (data) => this.submissions.set(data),
        error: (message: string) => this.handleError(message),
      });
  }

  create(dto: CreateSubmissionDto): void {
    this.clearError();
    this.beginRequest();
    this.submissionService
      .create(dto)
      .pipe(finalize(() => this.endRequest()))
      .subscribe({
        next: (created) => this.submissions.update(list => [...list, created]),
        error: (message: string) => this.handleError(message),
      });
  }

  remove(id: string): void {
    this.clearError();
    this.beginRequest();
    this.submissionService
      .delete(id)
      .pipe(finalize(() => this.endRequest()))
      .subscribe({
        next: () =>
          this.submissions.update(list =>
            list.filter(submission => submission.id !== id)
          ),
        error: (message: string) => this.handleError(message),
      });
  }
}