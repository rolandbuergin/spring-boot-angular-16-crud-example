import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  username = '';
  password = '';
  confirmPassword = '';
  message = '';
  error = '';

  constructor(private authService: AuthService) {}

  register(form: NgForm): void {
    if (form.invalid || this.password !== this.confirmPassword) {
      this.error = 'Die Passwörter müssen übereinstimmen.';
      this.message = '';
      return;
    }

    this.authService.register(this.username.trim(), this.password).subscribe({
      next: (res) => {
        this.message = res || 'Registrierung erfolgreich.';
        this.error = '';
        form.resetForm();
      },
      error: (err) => {
        this.message = '';
        this.error = err?.error || 'Registrierung fehlgeschlagen.';
      },
    });
  }
}
