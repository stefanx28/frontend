import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu'; 
import { ConfirmDeleteDialogComponent } from '../../components/confirm-delete-dialog/confirm-delete-dialog.component';
import {
  ProblemFormDialogComponent,
  ProblemFormDialogData,
  ProblemFormDialogResult,
} from '../../components/problem-form-dialog/problem-form-dialog.component';
import { CreateProblemDTO, Problem, UpdateProblemDTO } from '../../models/problem.model';
import { ProblemListStore } from './problem-list.store';

@Component({
  selector: 'app-problem-list-page',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatToolbarModule,
    MatMenuModule, 
  ],
  templateUrl: './problem-list-page.component.html',
  styleUrl: './problem-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProblemListPageComponent {
  private readonly dialog = inject(MatDialog);
  private readonly store = inject(ProblemListStore);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly problems = this.store.problems;
  protected readonly hasError = this.store.hasError;
  protected readonly isLoading = this.store.isLoading;
  protected readonly displayedColumns = ['title', 'description', 'difficulty', 'actions'];

  constructor() {
    this.store.load();
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
        if (confirmed) {
          this.store.remove(problem.id);
        }
      });
  }
}