import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Angular 16 Crud example';

  constructor(private authService: AuthService) {}

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  get username(): string | null {
    return this.authService.getUsername();
  }

  logout(): void {
    this.authService.logout();
  }
}
