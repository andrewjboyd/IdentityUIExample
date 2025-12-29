import { Component, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { IdentityExampleAPIService } from '../api/endpoints/identityExampleAPI.service';
import { AspNetClaims, UserClaimResponse } from '../api/models';
import { ToastService } from '../toast.service';

interface ClaimWithStatus {
  claimValue: string;
  hasAccess: boolean;
}

@Component({
  selector: 'app-user-claims',
  imports: [RouterLink],
  templateUrl: './user-claims.html',
  styleUrl: './user-claims.css',
})
export class UserClaims implements OnInit {
  availableClaims = signal<AspNetClaims[]>([]);
  usersClaims = signal<UserClaimResponse[]>([]);
  loading = signal(true);
  saving = signal(false);
  userId = signal<string>('');

  claimsWithStatus = computed<ClaimWithStatus[]>(() => {
    const userClaimValues = new Set(
      this.usersClaims().map((c) => c.value?.toLowerCase()),
    );
    return this.availableClaims()
      .filter((c) => c.claimValue)
      .map((claim) => ({
        claimValue: claim.claimValue!,
        hasAccess: userClaimValues.has(claim.claimValue?.toLowerCase()),
      }));
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: IdentityExampleAPIService,
    private toastService: ToastService,
  ) {}

  toggleClaim(claimValue: string, currentlyHasAccess: boolean): void {
    if (currentlyHasAccess) {
      this.usersClaims.update((claims) =>
        claims.filter((c) => c.value?.toLowerCase() !== claimValue.toLowerCase()),
      );
    } else {
      this.usersClaims.update((claims) => [
        ...claims,
        { value: claimValue },
      ]);
    }
  }

  save(): void {
    this.saving.set(true);
    const selectedClaims = this.claimsWithStatus()
      .filter((c) => c.hasAccess)
      .map((c) => c.claimValue);

    this.apiService.postUsersUserIdClaims(this.userId(), { roles: selectedClaims }).subscribe({
      next: () => {
        this.saving.set(false);
        this.toastService.success('Claims saved successfully');
        this.router.navigate(['/users']);
      },
      error: () => {
        this.saving.set(false);
        this.toastService.error('Failed to save claims');
      },
    });
  }

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('userId');
    if (userId) {
      this.userId.set(userId);
      forkJoin({
        allClaims: this.apiService.getClaims(),
        userClaims: this.apiService.getUsersUserIdClaims(userId),
      }).subscribe({
        next: ({ allClaims, userClaims }) => {
          this.availableClaims.set(allClaims);
          this.usersClaims.set(userClaims);
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
