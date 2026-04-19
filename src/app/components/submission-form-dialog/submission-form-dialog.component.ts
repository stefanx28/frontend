// submission-form-dialog.component.ts
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
  Injector,
  effect,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Language } from '../../models/enums/language.enum';
import { Person } from '../../models/person.model';
import { Problem } from '../../models/problem.model';
import { PersonService } from '../../services/person.service';
import { ProblemService } from '../../services/problem.service';

export interface SubmissionFormDialogData {
  title: string;
  submitLabel?: string;
  onSubmit: (dto: SubmissionFormValue) => void;
  errorMessage: () => string | null;
}

export interface SubmissionFormValue {
  personId: string;
  problemId: string;
  code: string;
  language: Language;
}

export type SubmissionFormDialogResult = SubmissionFormValue | undefined;

@Component({
  selector: 'app-submission-form-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './submission-form-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubmissionFormDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<SubmissionFormDialogComponent>);
  private readonly injector = inject(Injector);
  private readonly personService = inject(PersonService);
  private readonly problemService = inject(ProblemService);

  protected readonly data = inject<SubmissionFormDialogData>(MAT_DIALOG_DATA);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly languageOptions = Object.values(Language);

  protected persons = signal<Person[]>([]);
  protected problems = signal<Problem[]>([]);

  protected readonly form = this.fb.nonNullable.group({
    personId: ['', Validators.required],
    problemId: ['', Validators.required],
    code: ['', [Validators.required, Validators.minLength(10)]],
    language: [Language.JAVA, Validators.required],
  });

  ngOnInit(): void {
  
    this.personService.getAll().subscribe(data => this.persons.set(data));
    this.problemService.getAll().subscribe(data => this.problems.set(data));
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const val = this.form.getRawValue();
    this.data.onSubmit(val);

    setTimeout(() => {
       if (!this.data.errorMessage()) {
         this.dialogRef.close(val);
       }
     }, 100);
  }

  protected cancel(): void {
    this.dialogRef.close(undefined);
  }
}