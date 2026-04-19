import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  // Define the signals that the CustomerHomeComponent is looking for
  readonly userRole = signal<'ADMIN' | 'CUSTOMER' | null>(null);
  readonly personId = signal<string | null>(null);
  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  login(credentials: { email: string; password: any }) {
    this.isLoading.set(true);
    this.http.post<any>('http://localhost:8080/login', credentials).subscribe({
      next: (res) => {
        if (res.success) {
          // Set the signals used by your customer page
          this.userRole.set(res.role);
          this.personId.set(res.personId);
          
          if (res.role === 'ADMIN') {
            this.router.navigate(['/admin/problems']);
          } else {
            this.router.navigate(['/customer/home']);
          }
        } else {
          this.errorMessage.set(res.errorMessage);
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Connection failed');
        this.isLoading.set(false);
      }
    });
  }

  logout() {
    this.userRole.set(null);
    this.personId.set(null);
    this.router.navigate(['/login']);
  }
}