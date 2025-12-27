import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IdentityExampleAPIService } from '../api/endpoints/identityExampleAPI.service';
import { UserClaimResponse } from '../api/models';

@Component({
  selector: 'app-user-claims',
  imports: [RouterLink],
  templateUrl: './user-claims.html',
  styleUrl: './user-claims.css',
})
export class UserClaims implements OnInit {
  claims = signal<UserClaimResponse[]>([]);
  loading = signal(true);
  userId = signal<string>('');

  constructor(
    private route: ActivatedRoute,
    private apiService: IdentityExampleAPIService,
  ) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('userId');
    if (userId) {
      this.userId.set(userId);
      this.apiService.getUsersUserIdClaims(userId).subscribe({
        next: (claims) => {
          this.claims.set(claims);
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
