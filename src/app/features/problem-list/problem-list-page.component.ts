import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatToolbar } from '@angular/material/toolbar';
import { ConfirmDeleteDialogComponent } from '../../components/confirm-delete-dialog/confirm-delete-dialog.component';
import {
  ProblemFormDialogComponent,
  ProblemFormDialogData,
  ProblemFormDialogResult,
} from '../../components/problem-form-dialog/problem-form-dialog.component';
import { Difficulty } from '../../models/enums/difficulty.enum';
import { CreateProblemDTO, Problem, UpdateProblemDTO } from '../../models/problem.model';
import { ProblemListStore } from './problem-list.store';

@Component({
  selector: 'app-problem-list-page',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatToolbar,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
  ],
  templateUrl: './problem-list-page.component.html',
  styleUrl: './problem-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProblemListPageComponent {
  private readonly dialog = inject(MatDialog);
  private readonly store = inject(ProblemListStore);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly problems = this.store.filteredProblems;
  protected readonly hasError = this.store.hasError;
  protected readonly isLoading = this.store.isLoading;
  protected readonly displayedColumns = ['title', 'description', 'difficulty', 'solverCount', 'actions'];
  protected readonly difficultyOptions = Object.values(Difficulty);

  // local variables for filter inputs
  protected selectedDifficulty: Difficulty | null = null;
  protected minSolvers: number | null = null;
  protected maxSolvers: number | null = null;
  protected sortOrder: 'asc' | 'desc' | null = null;
  protected searchTitle: string = '';

  constructor() {
    this.store.load();
  }

  protected onSearchChange(): void {
    this.store.setSearchTitle(this.searchTitle);
  }

  protected onDifficultyChange(): void {
    this.store.setDifficultyFilter(this.selectedDifficulty);
  }

  protected onMinSolversChange(): void {
    this.store.setMinSolversFilter(this.minSolvers);
  }

  protected onMaxSolversChange(): void {
    this.store.setMaxSolversFilter(this.maxSolvers);
  }

  protected onSortOrderChange(): void {
    this.store.setSortOrder(this.sortOrder);
  }

  protected clearFilters(): void {
    this.selectedDifficulty = null;
    this.minSolvers = null;
    this.maxSolvers = null;
    this.sortOrder = null;
    this.searchTitle = '';
    this.store.clearFilters();
  }

  protected openCreateDialog(): void {
    if (this.isLoading()) return;
    this.dialog.open<ProblemFormDialogComponent, ProblemFormDialogData, ProblemFormDialogResult>(
      ProblemFormDialogComponent,
      {
        data: {
          title: 'Create Problem',
          submitLabel: 'Create',
          onSubmit: (dto) => this.store.create(dto as CreateProblemDTO),
          errorMessage: this.store.errorMessage,
        },
      },
    );
  }

  protected openEditDialog(problem: Problem): void {
    if (this.isLoading()) return;
    this.dialog.open<ProblemFormDialogComponent, ProblemFormDialogData, ProblemFormDialogResult>(
      ProblemFormDialogComponent,
      {
        data: {
          title: 'Edit Problem',
          submitLabel: 'Save',
          initialValue: problem,
          onSubmit: (dto) => this.store.update(problem.id, dto as UpdateProblemDTO),
          errorMessage: this.store.errorMessage,
        },
      },
    );
  }

  protected openDeleteDialog(problem: Problem): void {
    if (this.isLoading()) return;
    this.dialog
      .open<ConfirmDeleteDialogComponent, { problem: Problem }, boolean>(
        ConfirmDeleteDialogComponent,
        { data: { problem } },
      )
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((confirmed) => {
        if (!confirmed) return;
        this.store.remove(problem.id);
      });
  }
}