import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AuthStore } from './auth.store';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule, MatCardModule, MatFormFieldModule, 
    MatInputModule, MatButtonModule, MatProgressBarModule
  ],
  template: `
    <div class="login-page">
      <mat-card class="login-card">
        @if (authStore.isLoading()) {
          <mat-progress-bar mode="indeterminate"></mat-progress-bar>
        }
        
        <mat-card-header>
          <mat-card-title>Sign In</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email Address</mat-label>
              <input matInput formControlName="email" type="email" placeholder="admin@example.com">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput formControlName="password" type="password">
            </mat-form-field>

            @if (authStore.errorMessage()) {
              <div class="error-msg">{{ authStore.errorMessage() }}</div>
            }

            <button mat-flat-button color="primary" class="full-width" 
                    [disabled]="form.invalid || authStore.isLoading()">
              Login
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-page { display: flex; justify-content: center; align-items: center; height: 100vh; background: #f5f5f5; }
    .login-card { width: 100%; max-width: 380px; padding: 16px; }
    .full-width { width: 100%; margin-top: 8px; }
    .error-msg { color: #f44336; margin: 8px 0; text-align: center; font-size: 0.9rem; }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  protected authStore = inject(AuthStore);

  protected form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  onSubmit() {
    if (this.form.valid) {
      this.authStore.login(this.form.getRawValue());
    }
  }
}