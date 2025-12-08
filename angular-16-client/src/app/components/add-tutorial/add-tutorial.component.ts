import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Tutorial } from 'src/app/models/tutorial.model';
import { TutorialService } from 'src/app/services/tutorial.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-add-tutorial',
  templateUrl: './add-tutorial.component.html',
  styleUrls: ['./add-tutorial.component.css'],
})
export class AddTutorialComponent {
  tutorial: Tutorial = {
    title: '',
    description: '',
    einwohner: undefined,
    published: false
  };
  submitted = false;
  errorMessage = '';

  constructor(private tutorialService: TutorialService, public authService: AuthService) {}

  saveTutorial(form: NgForm): void {
    if (!this.authService.isAuthenticated()) {
      this.errorMessage = 'Bitte melden Sie sich als Redakteur an, um Änderungen zu speichern.';
      return;
    }

    if (form.invalid) {
      return;
    }

    const data = {
      title: this.trimmedText(this.tutorial.title),
      description: this.trimmedText(this.tutorial.description),
      einwohner: this.tutorial.einwohner
    };

    this.tutorial.title = data.title;
    this.tutorial.description = data.description;

    this.tutorialService.create(data).subscribe({
      next: (res) => {
        console.log(res);
        this.submitted = true;
        this.errorMessage = '';
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = this.buildErrorMessage(error);
      }
    });
  }

  newTutorial(): void {
    this.submitted = false;
    this.errorMessage = '';
    this.tutorial = {
      title: '',
      description: '',
      einwohner: undefined,
      published: false
    };
  }

  private buildErrorMessage(error: any): string {
    if (error?.error) {
      if (typeof error.error === 'string') {
        return error.error;
      }

      if (typeof error.error === 'object') {
        return Object.values(error.error).join(' ');
      }
    }

    return 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.';
  }

  hasEdgeWhitespace(value?: string): boolean {
    return value != null && (/^\s/.test(value) || /\s$/.test(value));
  }

  private trimmedText(value?: string): string {
    return value?.trim() ?? '';
  }
}
