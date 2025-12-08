import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username = '';
  password = '';
  message = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  login(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    this.authService.login(this.username.trim(), this.password).subscribe({
      next: (res) => {
        this.message = res || 'Anmeldung erfolgreich.';
        this.error = '';
        this.router.navigate(['/tutorials']);
      },
      error: (err) => {
        this.message = '';
        this.error = err?.error || 'Anmeldung fehlgeschlagen.';
      },
    });
  }
}
