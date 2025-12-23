import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { getUser, postLogin, postLogout } from './api/endpoints/identityExampleAPI';
import { SignInRequest } from './api/models/signInRequest';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUser = signal<any>(null);

  constructor(private router: Router) {}

  async checkAuth(): Promise<boolean> {
    try {
      const response = await getUser();
      if (response.status === 200) {
        this.currentUser.set(response.data);
        return true;
      }
      return false;
    } catch (error: any) {
      return false;
    }
  }

  async login(credentials: SignInRequest): Promise<void> {
    const response = await postLogin(credentials);
    if (response.status !== 200) {
      const error = new Error('Login failed');
      (error as any).status = response.status;
      (error as any).error = response.data;
      throw error;
    }
    await this.checkAuth();
  }

  redirectToLogin(returnUrl?: string): void {
    const url = returnUrl || this.router.url;
    this.router.navigate(['/login'], { queryParams: { returnUrl: url } });
  }

  async logout(): Promise<void> {
    await postLogout();
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }
}
