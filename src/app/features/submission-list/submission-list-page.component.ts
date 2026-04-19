// submission-list-page.component.ts
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatToolbar } from '@angular/material/toolbar';
import { ConfirmDeleteDialogComponent } from '../../components/confirm-delete-dialog/confirm-delete-dialog.component';
import {
  SubmissionFormDialogComponent,
  SubmissionFormDialogData,
} from '../../components/submission-form-dialog/submission-form-dialog.component';
import { CreateSubmissionDto, Submission } from '../../models/submission.model';
import { SubmissionListStore } from './submission-list.store';

@Component({
  selector: 'app-submission-list-page',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatToolbar,
  ],
  templateUrl: './submission-list-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubmissionListPageComponent {
  private readonly dialog = inject(MatDialog);
  private readonly store = inject(SubmissionListStore);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly submissions = this.store.submissions;
  protected readonly hasError = this.store.hasError;
  protected readonly isLoading = this.store.isLoading;
  protected readonly displayedColumns = [
    'personName', 'problemTitle', 'language', 'result', 'submittedAt', 'actions'
  ];

  constructor() {
    this.store.load();
  }

  protected openCreateDialog(): void {
    if (this.isLoading()) return;

    this.dialog.open<SubmissionFormDialogComponent, SubmissionFormDialogData>(
      SubmissionFormDialogComponent,
      {
        data: {
          title: 'Submit Solution',
          submitLabel: 'Submit',
          onSubmit: (dto) => this.store.create(dto as CreateSubmissionDto),
          errorMessage: this.store.errorMessage,
        },
      },
    );
  }

  protected openDeleteDialog(submission: Submission): void {
    if (this.isLoading()) return;

    this.dialog
      .open<ConfirmDeleteDialogComponent, { submission: Submission }, boolean>(
        ConfirmDeleteDialogComponent,
        { data: { submission } },
      )
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((confirmed) => {
        if (!confirmed) return;
        this.store.remove(submission.id);
      });
  }
}