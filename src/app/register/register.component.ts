import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { postRegister } from '../api/endpoints/identityExampleAPI';

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

  constructor(private router: Router) {}

  async onSubmit(): Promise<void> {
    this.error.set(null);

    if (this.password() !== this.confirmPassword()) {
      this.error.set('Passwords do not match.');
      return;
    }

    this.loading.set(true);

    try {
      const response = await postRegister({
        email: this.email(),
        password: this.password(),
      });
      
      if (response.status === 400) {
        const errorData = response.data;
        this.error.set(errorData?.join('\n') || 'Registration failed. Please try again.');
        return;
      }

      this.router.navigate(['/login'], {
        queryParams: { registered: 'true' },
      });
    } catch (err: any) {
      this.error.set('Registration failed. Please try again.');
    } finally {
      this.loading.set(false);
    }
  }
}
