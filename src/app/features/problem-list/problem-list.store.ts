import { computed, inject, Injectable, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { CreateProblemDTO, Problem, UpdateProblemDTO } from '../../models/problem.model';
import { Difficulty } from '../../models/enums/difficulty.enum';
import { ProblemService } from '../../services/problem.service';

@Injectable({ providedIn: 'root' })
export class ProblemListStore {
  private readonly problemService = inject(ProblemService);
  private readonly pendingRequests = signal(0);

  readonly problems = signal<Problem[]>([]);
  readonly hasError = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly isLoading = computed(() => this.pendingRequests() > 0);

  readonly filterDifficulty = signal<Difficulty | null>(null);
  readonly filterMinSolvers = signal<number | null>(null);
  readonly filterMaxSolvers = signal<number | null>(null);
  readonly sortOrder = signal<'asc' | 'desc' | null>(null);
  readonly searchTitle = signal<string>('');

  
  readonly filteredProblems = computed(() => {
    let result = [...this.problems()];

    
    const search = this.searchTitle().toLowerCase().trim();
    if (search) {
      result = result.filter(p =>
        p.title.toLowerCase().includes(search)
      );
    }

  
    const difficulty = this.filterDifficulty();
    if (difficulty) {
      result = result.filter(p => p.difficulty === difficulty);
    }


    const minSolvers = this.filterMinSolvers();
    if (minSolvers !== null) {
      result = result.filter(p => (p.solverCount ?? 0) >= minSolvers);
    }

  
    const maxSolvers = this.filterMaxSolvers();
    if (maxSolvers !== null) {
      result = result.filter(p => (p.solverCount ?? 0) <= maxSolvers);
    }

    // sort by solver count
    const sort = this.sortOrder();
    if (sort === 'asc') {
      result.sort((a, b) => (a.solverCount ?? 0) - (b.solverCount ?? 0));
    } else if (sort === 'desc') {
      result.sort((a, b) => (b.solverCount ?? 0) - (a.solverCount ?? 0));
    }

    return result;
  });

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


  setDifficultyFilter(difficulty: Difficulty | null): void {
    this.filterDifficulty.set(difficulty);
  }

  setMinSolversFilter(min: number | null): void {
    this.filterMinSolvers.set(min);
  }

  setMaxSolversFilter(max: number | null): void {
    this.filterMaxSolvers.set(max);
  }

  setSortOrder(order: 'asc' | 'desc' | null): void {
    this.sortOrder.set(order);
  }

  setSearchTitle(title: string): void {
    this.searchTitle.set(title);
  }

  clearFilters(): void {
    this.filterDifficulty.set(null);
    this.filterMinSolvers.set(null);
    this.filterMaxSolvers.set(null);
    this.sortOrder.set(null);
    this.searchTitle.set('');
  }

  load(): void {
    this.clearError();
    this.beginRequest();
    this.problemService
      .getAll()
      .pipe(finalize(() => this.endRequest()))
      .subscribe({
        next: (data) => this.problems.set(data),
        error: (message: string) => this.handleError(message),
      });
  }

  create(dto: CreateProblemDTO): void {
    this.clearError();
    this.beginRequest();
    this.problemService
      .create(dto)
      .pipe(finalize(() => this.endRequest()))
      .subscribe({
        next: (created) => this.problems.update(list => [...list, created]),
        error: (message: string) => this.handleError(message),
      });
  }

  update(id: string, dto: UpdateProblemDTO): void {
    this.clearError();
    this.beginRequest();
    this.problemService
      .update(id, dto)
      .pipe(finalize(() => this.endRequest()))
      .subscribe({
        next: (updated) =>
          this.problems.update(list =>
            list.map(problem => problem.id === updated.id ? updated : problem)
          ),
        error: (message: string) => this.handleError(message),
      });
  }

  remove(id: string): void {
    this.clearError();
    this.beginRequest();
    this.problemService
      .delete(id)
      .pipe(finalize(() => this.endRequest()))
      .subscribe({
        next: () =>
          this.problems.update(list =>
            list.filter(problem => problem.id !== id)
          ),
        error: (message: string) => this.handleError(message),
      });
  }
}