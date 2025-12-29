import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, map, tap, switchMap, catchError, of, throwError } from 'rxjs';
import { IdentityExampleAPIService } from './api/endpoints/identityExampleAPI.service';
import { SignInRequest } from './api/models/signInRequest';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUser = signal<any>(null);

  constructor(
    private router: Router,
    private api: IdentityExampleAPIService,
  ) {}

  checkAuth(): Observable<boolean> {
    return this.api.getUser().pipe(
      tap((data) => this.currentUser.set(data)),
      map(() => true),
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          return of(false);
        }
        return throwError(() => err);
      }),
    );
  }

  login(credentials: SignInRequest): Observable<void> {
    return this.api.postLogin(credentials).pipe(
      switchMap(() => this.checkAuth()),
      map(() => undefined),
    );
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  redirectToLogin(returnUrl?: string): void {
    const url = returnUrl || this.router.url;
    this.router.navigate(['/login'], { queryParams: { returnUrl: url } });
  }

  logout(): Observable<void> {
    return this.api.postLogout().pipe(
      tap(() => {
        this.currentUser.set(null);
        this.router.navigate(['/login']);
      }),
    );
  }
}
