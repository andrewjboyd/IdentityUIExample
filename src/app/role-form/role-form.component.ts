import { Component, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { IdentityExampleAPIService } from '../api/endpoints/identityExampleAPI.service';
import { IdentityRole } from '../api/models';
import { ToastService } from '../toast.service';

interface Claim {
  claimValue: string;
}

interface ClaimWithStatus {
  claimValue: string;
  isSelected: boolean;
}

@Component({
  selector: 'app-role-form',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './role-form.component.html',
  styleUrl: './role-form.component.css',
})
export class RoleFormComponent implements OnInit {
  availableClaims = signal<Claim[]>([]);
  selectedClaims = signal<Set<string>>(new Set());
  loading = signal(true);
  saving = signal(false);
  roleId = signal<string | null>(null);
  roleName = signal('');
  role = signal<IdentityRole | null>(null);

  isEditMode = computed(() => this.roleId() !== null);

  claimsWithStatus = computed<ClaimWithStatus[]>(() => {
    const selected = this.selectedClaims();
    return this.availableClaims()
      .filter((c) => c.claimValue)
      .map((claim) => ({
        claimValue: claim.claimValue,
        isSelected: selected.has(claim.claimValue.toLowerCase()),
      }));
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: IdentityExampleAPIService,
    private toastService: ToastService,
  ) {}

  toggleClaim(claimValue: string, currentlySelected: boolean): void {
    this.selectedClaims.update((claims) => {
      const newClaims = new Set(claims);
      const lowerValue = claimValue.toLowerCase();
      if (currentlySelected) {
        newClaims.delete(lowerValue);
      } else {
        newClaims.add(lowerValue);
      }
      return newClaims;
    });
  }

  updateRoleName(event: Event): void {
    this.roleName.set((event.target as HTMLInputElement).value);
  }

  save(): void {
    const name = this.roleName().trim();
    if (!name) {
      this.toastService.error('Role name is required');
      return;
    }

    this.saving.set(true);
    const claims = this.claimsWithStatus()
      .filter((c) => c.isSelected)
      .map((c) => c.claimValue);

    if (this.isEditMode()) {
      this.apiService
        .postRolesRoleId(this.roleId()!, {
          id: this.roleId(),
          roleName: name,
          claims,
        })
        .subscribe({
          next: () => {
            this.saving.set(false);
            this.toastService.success('Role updated successfully');
            this.router.navigate(['/roles']);
          },
          error: () => {
            this.saving.set(false);
            this.toastService.error('Failed to update role');
          },
        });
    } else {
      this.apiService
        .postRoles({
          roleName: name,
          claims,
        })
        .subscribe({
          next: () => {
            this.saving.set(false);
            this.toastService.success('Role created successfully');
            this.router.navigate(['/roles']);
          },
          error: () => {
            this.saving.set(false);
            this.toastService.error('Failed to create role');
          },
        });
    }
  }

  ngOnInit(): void {
    const roleId = this.route.snapshot.paramMap.get('roleId');

    if (roleId) {
      this.roleId.set(roleId);
      forkJoin({
        allClaims: this.apiService.getClaims<Claim[]>(),
        allRoles: this.apiService.getRoles<IdentityRole[]>(),
      }).subscribe({
        next: ({ allClaims, allRoles }) => {
          this.availableClaims.set(allClaims);
          const role = allRoles.find((r) => r.id === roleId);
          if (role) {
            this.role.set(role);
            this.roleName.set(role.name || '');
          }
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.toastService.error('Failed to load role data');
        },
      });
    } else {
      this.apiService.getClaims<Claim[]>().subscribe({
        next: (claims) => {
          this.availableClaims.set(claims);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.toastService.error('Failed to load claims');
        },
      });
    }
  }
}
