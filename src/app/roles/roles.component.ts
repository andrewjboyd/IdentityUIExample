import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IdentityExampleAPIService } from '../api/endpoints/identityExampleAPI.service';
import { IdentityRole } from '../api/models';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css',
})
export class RolesComponent implements OnInit {
  roles = signal<IdentityRole[]>([]);
  loading = signal(true);

  constructor(
    private apiService: IdentityExampleAPIService,
    private router: Router,
  ) {}

  editRole(roleId: string): void {
    this.router.navigate(['/roles', roleId, 'edit']);
  }

  ngOnInit(): void {
    this.apiService.getRoles<IdentityRole[]>().subscribe({
      next: (roles) => {
        this.roles.set(roles);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
}
