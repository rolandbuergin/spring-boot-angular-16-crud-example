import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Tutorial } from 'src/app/models/tutorial.model';
import { TutorialService } from 'src/app/services/tutorial.service';

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

  constructor(private tutorialService: TutorialService) {}

  saveTutorial(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    const data = {
      title: this.tutorial.title,
      description: this.tutorial.description,
      einwohner: this.tutorial.einwohner
    };

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
}
