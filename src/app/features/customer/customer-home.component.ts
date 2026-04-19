// File: src/app/features/customer/customer-home.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthStore } from '../../features/auth/auth.store';

@Component({
  selector: 'app-customer-home',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatToolbarModule],
  template: `
    <mat-toolbar color="accent">
      <span>Customer Portal</span>
      <span class="spacer"></span>
      <button mat-button (click)="authStore.logout()">Logout</button>
    </mat-toolbar>

    <div class="content">
      <h1>Welcome, {{ authStore.userRole() === 'CUSTOMER' ? 'Customer' : 'Guest' }}!</h1>
      
      <div class="status-card">
        <h3>User Details</h3>
        <p><strong>Role:</strong> {{ authStore.userRole() }}</p>
        <p><strong>ID:</strong> {{ authStore.personId() }}</p>
      </div>

      
    </div>
  `,
  styles: [`
    .spacer { flex: 1 1 auto; }
    .content {
      padding: 40px;
      text-align: center;
      font-family: Roboto, "Helvetica Neue", sans-serif;
    }
    .status-card {
      background: #f5f5f5;
      border-radius: 8px;
      padding: 20px;
      display: inline-block;
      margin-top: 20px;
      border: 1px solid #ddd;
      text-align: left;
    }
    .note {
      margin-top: 40px;
      color: #666;
      font-style: italic;
    }
  `]
})
export class CustomerHomeComponent {
  protected readonly authStore = inject(AuthStore);
}