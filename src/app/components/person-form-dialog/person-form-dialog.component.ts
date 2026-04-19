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

export interface PersonFormDialogData {
  title: string;
  submitLabel?: string;
  showPasswordField?: boolean;
  initialValue?: PersonFormInitialValue | null;
  onSubmit: (dto: PersonFormValue) => void;         
  errorMessage: () => string | null; 
}

export interface PersonFormValue {
  name: string;
  age: number;
  email: string;
  password?: string;
}

export interface PersonFormInitialValue {
  name: string;
  age: number;
  email: string;
}

export type PersonFormDialogResult = PersonFormValue | undefined;

@Component({
  selector: 'app-person-form-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './person-form-dialog.component.html',
  styleUrl: './person-form-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonFormDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<PersonFormDialogComponent>);
  protected readonly data = inject<PersonFormDialogData>(MAT_DIALOG_DATA);

  protected readonly isPasswordVisible = signal(false);
  protected readonly errorMessage = signal<string | null>(null);  

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    age: [0, [Validators.required, Validators.min(18), Validators.max(200)]],
    email: ['', [Validators.required]],
    password: ['', []],
  });

  ngOnInit(): void {
    if (this.data.initialValue) {
      this.form.patchValue(this.data.initialValue);
    }

    if (this.data.showPasswordField) {
      this.form.controls.password.setValidators([Validators.required]);
      this.form.controls.password.updateValueAndValidity();
    }
  }

  
  showError(message: string): void {
    this.errorMessage.set(message);
  }

  protected togglePasswordVisibility(): void {
    this.isPasswordVisible.update((v) => !v);
  }

 private readonly injector = inject(Injector);

protected submit(): void {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  this.errorMessage.set(null);

  const { name, age, email, password } = this.form.getRawValue();
  const result = this.data.showPasswordField
    ? { name, age, email, password }
    : { name, age, email };

  this.data.onSubmit(result);   // call store directly

  effect(() => {
    const error = this.data.errorMessage();
    if (error) {
      this.errorMessage.set(error);   // show error inside dialog
    } else {
      this.dialogRef.close(result);   // close only on success
    }
  }, { injector: this.injector });
}

  protected cancel(): void {
    this.dialogRef.close(undefined);
  }
}