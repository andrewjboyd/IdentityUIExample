import { Component, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { IdentityExampleAPIService } from '../api/endpoints/identityExampleAPI.service';
import { ToastService } from '../toast.service';

interface Role {
  id: string;
  name: string;
}

interface RoleWithStatus {
  id: string;
  name: string;
  hasAccess: boolean;
}

@Component({
  selector: 'app-user-roles',
  imports: [RouterLink],
  templateUrl: './user-roles.html',
  styleUrl: './user-roles.css',
})
export class UserRoles implements OnInit {
  availableRoles = signal<Role[]>([]);
  userRoles = signal<Role[]>([]);
  loading = signal(true);
  saving = signal(false);
  userId = signal<string>('');

  rolesWithStatus = computed<RoleWithStatus[]>(() => {
    const userRoleIds = new Set(this.userRoles().map((r) => r.id));
    return this.availableRoles().map((role) => ({
      id: role.id,
      name: role.name,
      hasAccess: userRoleIds.has(role.id),
    }));
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: IdentityExampleAPIService,
    private toastService: ToastService,
  ) {}

  toggleRole(roleId: string, currentlyHasAccess: boolean): void {
    if (currentlyHasAccess) {
      this.userRoles.update((roles) => roles.filter((r) => r.id !== roleId));
    } else {
      const role = this.availableRoles().find((r) => r.id === roleId);
      if (role) {
        this.userRoles.update((roles) => [...roles, role]);
      }
    }
  }

  save(): void {
    this.saving.set(true);
    const selectedRoleIds = this.rolesWithStatus()
      .filter((r) => r.hasAccess)
      .map((r) => r.id);

    this.apiService.postUsersUserIdRoles(this.userId(), { roleIds: selectedRoleIds }).subscribe({
      next: () => {
        this.saving.set(false);
        this.toastService.success('Roles saved successfully');
        this.router.navigate(['/users']);
      },
      error: () => {
        this.saving.set(false);
        this.toastService.error('Failed to save roles');
      },
    });
  }

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('userId');
    if (userId) {
      this.userId.set(userId);
      forkJoin({
        allRoles: this.apiService.getRoles<Role[]>(),
        userRoles: this.apiService.getUsersUserIdRoles<Role[]>(userId),
      }).subscribe({
        next: ({ allRoles, userRoles }) => {
          this.availableRoles.set(allRoles);
          this.userRoles.set(userRoles);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        },
      });
    } else {
      this.loading.set(false);
    }
  }
}
