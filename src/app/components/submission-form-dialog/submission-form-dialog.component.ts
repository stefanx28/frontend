import { ChangeDetectionStrategy, Component, OnInit, Signal, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Language } from '../../models/enums/language.enum';

export interface SubmissionFormDialogData {
  title: string;
  submitLabel?: string;
  initialValue?: SubmissionFormInitialValue | null;
  onSubmit: (value: SubmissionFormValue) => void;
  errorMessage: Signal<string | null>;
}

export interface SubmissionFormValue {
  problemId: string;
  code: string;
  language: Language;
}

export interface SubmissionFormInitialValue {
  problemId: string;
  code: string;
  language: Language;
}

export type SubmissionFormDialogResult = SubmissionFormValue | undefined;

@Component({
  selector: 'app-submission-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './submission-form-dialog.component.html',
  styleUrl: './submission-form-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubmissionFormDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<SubmissionFormDialogComponent>);
  protected readonly data = inject<SubmissionFormDialogData>(MAT_DIALOG_DATA);

  protected readonly languageOptions = Object.values(Language);

  protected readonly form = this.fb.nonNullable.group({
    problemId: ['', [Validators.required]],
    code: ['', [Validators.required, Validators.minLength(1)]],
    language: [Language.JAVA, [Validators.required]],
  });

  ngOnInit(): void {
    if (this.data.initialValue) {
      this.form.patchValue(this.data.initialValue);
    }
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.data.onSubmit(this.form.getRawValue());
    this.dialogRef.close();
  }

  protected cancel(): void {
    this.dialogRef.close(undefined);
  }
}