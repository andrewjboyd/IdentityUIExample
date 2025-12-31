import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IdentityExampleAPIService } from '../api/endpoints/identityExampleAPI.service';
import { UserResponse } from '../api/models';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit {
  users = signal<UserResponse[]>([]);
  loading = signal(true);

  constructor(
    private apiService: IdentityExampleAPIService,
    private router: Router,
  ) {}

  viewClaims(userId: string): void {
    this.router.navigate(['/users', userId, 'claims']);
  }

  viewRoles(userId: string): void {
    this.router.navigate(['/users', userId, 'roles']);
  }

  ngOnInit(): void {
    this.apiService.getUsers().subscribe({
      next: (users) => {
        this.users.set(users);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
}
