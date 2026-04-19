import { ChangeDetectionStrategy, Component, OnInit, Signal, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Difficulty } from '../../models/enums/difficulty.enum';

export interface ProblemFormDialogData {
  title: string;
  submitLabel?: string;
  initialValue?: ProblemFormInitialValue | null;
  onSubmit: (value: ProblemFormValue) => void;
  errorMessage: Signal<string | null>;
}

export interface ProblemFormValue {
  title: string;
  description: string;
  difficulty: Difficulty;
}

export interface ProblemFormInitialValue {
  title: string;
  description: string;
  difficulty: Difficulty;
}

export type ProblemFormDialogResult = ProblemFormValue | undefined;

@Component({
  selector: 'app-problem-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './problem-form-dialog.component.html',
  styleUrl: './problem-form-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProblemFormDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<ProblemFormDialogComponent>);
  protected readonly data = inject<ProblemFormDialogData>(MAT_DIALOG_DATA);

  protected readonly difficultyOptions = Object.values(Difficulty);

  protected readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    difficulty: [Difficulty.EASY, [Validators.required]],
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