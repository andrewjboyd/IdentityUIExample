import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { IdentityExampleAPIService } from '../api/endpoints/identityExampleAPI.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  email = signal('');
  password = signal('');
  confirmPassword = signal('');
  error = signal<string | null>(null);
  loading = signal(false);

  constructor(
    private authService: AuthService,
    private api: IdentityExampleAPIService,
  ) {}

  onSubmit(): void {
    this.error.set(null);

    if (this.password() !== this.confirmPassword()) {
      this.error.set('Passwords do not match.');
      return;
    }

    this.loading.set(true);

    this.api
      .postRegister({
        email: this.email(),
        password: this.password(),
      })
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.authService.redirectToLogin();
        },
        error: (err) => {
          this.loading.set(false);
          if (err.status === 400 && err.error) {
            const errorData = err.error;
            this.error.set(
              Array.isArray(errorData)
                ? errorData.join('\n')
                : 'Registration failed. Please try again.',
            );
          } else {
            this.error.set('Registration failed. Please try again.');
          }
        },
      });
  }
}
