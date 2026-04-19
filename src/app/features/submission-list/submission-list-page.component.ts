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
  SubmissionFormDialogComponent,
  SubmissionFormDialogData,
  SubmissionFormDialogResult,
} from '../../components/submission-form-dialog/submission-form-dialog.component';
import { CreateSubmissionDTO, Submission, UpdateSubmissionDTO } from '../../models/submission.model';
import { SubmissionListStore } from './submission-list.store';

@Component({
  selector: 'app-submission-list-page',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatToolbarModule,
    MatMenuModule, 
  ],
  templateUrl: './submission-list-page.component.html',
  styleUrl: './submission-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubmissionListPageComponent {
  private readonly dialog = inject(MatDialog);
  private readonly store = inject(SubmissionListStore);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly submissions = this.store.submissions;
  protected readonly hasError = this.store.hasError;
  protected readonly isLoading = this.store.isLoading;
  protected readonly displayedColumns = ['problemId', 'language', 'result', 'actions'];

  constructor() {
    this.store.load();
  }

  protected openCreateDialog(): void {
    if (this.isLoading()) return;

    this.dialog.open<SubmissionFormDialogComponent, SubmissionFormDialogData, SubmissionFormDialogResult>(
      SubmissionFormDialogComponent,
      {
        data: {
          title: 'Create Submission',
          submitLabel: 'Create',
          onSubmit: (dto) => this.store.create(dto as CreateSubmissionDTO),
          errorMessage: this.store.errorMessage,
        },
      },
    );
  }

  protected openEditDialog(submission: Submission): void {
    if (this.isLoading()) return;

    this.dialog.open<SubmissionFormDialogComponent, SubmissionFormDialogData, SubmissionFormDialogResult>(
      SubmissionFormDialogComponent,
      {
        data: {
          title: 'Edit Submission',
          submitLabel: 'Save',
          initialValue: submission,
          onSubmit: (dto) => this.store.update(submission.id, dto as UpdateSubmissionDTO),
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
        if (confirmed) {
          this.store.remove(submission.id);
        }
      });
  }
}