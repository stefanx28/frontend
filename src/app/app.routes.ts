import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login', 
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login.component').then(
        (m) => m.LoginComponent
      ),
  },
 
  {
    path: 'admin',
    children: [
      {
        path: 'people',
        loadComponent: () =>
          import('./features/person-list/person-list-page.component').then(
            (m) => m.PersonListPageComponent
          ),
      },
      {
        path: 'problems',
        loadComponent: () =>
          import('./features/problem-list/problem-list-page.component').then(
            (m) => m.ProblemListPageComponent
          ),
      },
      {
        path: 'submissions',
        loadComponent: () =>
          import('./features/submission-list/submission-list-page.component').then(
            (m) => m.SubmissionListPageComponent
          ),
      },
    ]
  },
  
  {
    path: 'customer',
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./features/customer/customer-home.component').then(
            (m) => m.CustomerHomeComponent
          ),
      },
    ]
  },
  {
    path: 'error',
    loadComponent: () =>
      import('./features/not-found/not-found-page.component').then(
        (m) => m.NotFoundPageComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'error',
  },
];