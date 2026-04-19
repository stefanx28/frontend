import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'people',
  },
  {
    path: 'people',
    loadComponent: () =>
      import('./features/person-list/person-list-page.component').then(
        (m) => m.PersonListPageComponent,
      ),
  },
  {
    path: 'problem',
    loadComponent: () =>
      import('./features/problem-list/problem-list-page.component').then(
        (m) => m.ProblemListPageComponent,
      ),
  },
   {
    path: 'submission',
    loadComponent: () =>
      import('./features/submission-list/submission-list-page.component').then(
        (m) => m.SubmissionListPageComponent,
      ),
  },
  {
    path: 'error',
    loadComponent: () =>
      import('./features/not-found/not-found-page.component').then(
        (m) => m.NotFoundPageComponent,
      ),
  },
  {
    path: '**',
    redirectTo: 'error',
  },
];
