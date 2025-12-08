import { Component, OnInit } from '@angular/core';
import { Tutorial } from 'src/app/models/tutorial.model';
import { TutorialService } from 'src/app/services/tutorial.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  username = '';
  password = '';
  loginError = '';
  isAuthenticated = false;
  tutorials: Tutorial[] = [];
  loading = false;
  loadError = '';

  constructor(private tutorialService: TutorialService) {}

  ngOnInit(): void {
    this.isAuthenticated = localStorage.getItem('adminLoggedIn') === 'true';

    if (this.isAuthenticated) {
      this.loadTutorials();
    }
  }

  login(): void {
    const trimmedUser = this.username.trim();
    const trimmedPassword = this.password.trim();

    if (trimmedUser === 'admin' && trimmedPassword === 'admin') {
      this.isAuthenticated = true;
      this.loginError = '';
      localStorage.setItem('adminLoggedIn', 'true');
      this.loadTutorials();
    } else {
      this.loginError = 'Ungültige Zugangsdaten.';
      this.password = '';
    }
  }

  logout(): void {
    this.isAuthenticated = false;
    this.username = '';
    this.password = '';
    this.tutorials = [];
    this.loadError = '';
    localStorage.removeItem('adminLoggedIn');
  }

  loadTutorials(): void {
    this.loading = true;
    this.loadError = '';

    this.tutorialService.getAll().subscribe({
      next: (data) => {
        this.tutorials = data;
        this.loading = false;
      },
      error: (error) => {
        console.error(error);
        this.loadError = 'Einträge konnten nicht geladen werden.';
        this.loading = false;
      }
    });
  }

  deleteTutorial(id?: any): void {
    if (id == null) {
      return;
    }

    this.tutorialService.delete(id).subscribe({
      next: () => {
        this.tutorials = this.tutorials.filter((tutorial) => tutorial.id !== id);
      },
      error: (error) => {
        console.error(error);
        this.loadError = 'Eintrag konnte nicht gelöscht werden.';
      }
    });
  }
}
