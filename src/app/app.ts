import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('Identity UI Example');
  protected readonly menuCollapsed = signal(false);

  constructor(private authService: AuthService) {}

  toggleMenu(): void {
    this.menuCollapsed.update((v) => !v);
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout(): void {
    this.authService.logout().subscribe();
  }

  ngOnInit(): void {
    this.authService.checkAuth().subscribe();
  }
}
