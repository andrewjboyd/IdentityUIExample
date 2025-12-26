import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const reqWithCredentials = req.clone({
    withCredentials: true,
  });

  // Don't redirect on 401 for auth endpoints (login, register)
  const isAuthEndpoint = req.url.includes('/login') || req.url.includes('/register');

  return next(reqWithCredentials).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !isAuthEndpoint) {
        authService.redirectToLogin();
      }
      return throwError(() => error);
    }),
  );
};
