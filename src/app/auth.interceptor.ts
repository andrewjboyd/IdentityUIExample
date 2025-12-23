import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const reqWithCredentials = req.clone({
    withCredentials: true,
  });

  return next(reqWithCredentials).pipe(
    catchError((error: HttpErrorResponse) => {
      // Status 401 = Unauthorized
      // Status 0 = CORS error or network error (often means authentication failed but CORS blocks the response)
      if (error.status === 401 || error.status === 0) {
        authService.redirectToLogin();
      }
      return throwError(() => error);
    }),
  );
};
