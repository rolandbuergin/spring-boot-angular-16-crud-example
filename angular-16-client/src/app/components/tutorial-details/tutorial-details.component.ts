import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TutorialService } from 'src/app/services/tutorial.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Tutorial } from 'src/app/models/tutorial.model';

@Component({
  selector: 'app-tutorial-details',
  templateUrl: './tutorial-details.component.html',
  styleUrls: ['./tutorial-details.component.css'],
})
export class TutorialDetailsComponent implements OnInit {
  @Input() viewMode = false;

  @Input() currentTutorial: Tutorial = {
    title: '',
    description: '',
    einwohner: undefined,
    published: false
  };

  message = '';
  errorMessage = '';

  constructor(
    private tutorialService: TutorialService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.viewMode) {
      this.message = '';
      this.getTutorial(this.route.snapshot.params['id']);
    }
  }

  getTutorial(id: string): void {
    this.tutorialService.get(id).subscribe({
      next: (data) => {
        this.currentTutorial = data;
        console.log(data);
      },
      error: (e) => console.error(e)
    });
  }

  updatePublished(status: boolean): void {
    const data = {
      title: this.trimmedText(this.currentTutorial.title),
      description: this.trimmedText(this.currentTutorial.description),
      einwohner: this.currentTutorial.einwohner,
      published: status
    };

    this.currentTutorial.title = data.title;
    this.currentTutorial.description = data.description;

    this.message = '';

    this.tutorialService.update(this.currentTutorial.id, data).subscribe({
      next: (res) => {
        console.log(res);
        this.currentTutorial.published = status;
        this.message = res.message
          ? res.message
          : 'The status was updated successfully!';
      },
      error: (e) => console.error(e)
    });
  }

  updateTutorial(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    this.message = '';
    this.errorMessage = '';

    this.currentTutorial.title = this.trimmedText(this.currentTutorial.title);
    this.currentTutorial.description = this.trimmedText(this.currentTutorial.description);

    this.tutorialService
      .update(this.currentTutorial.id, this.currentTutorial)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.message = res.message
            ? res.message
            : 'This tutorial was updated successfully!';
        },
        error: (error) => {
          console.error(error);
          this.errorMessage = this.buildErrorMessage(error);
        }
      });
  }

  deleteTutorial(): void {
    this.tutorialService.delete(this.currentTutorial.id).subscribe({
      next: (res) => {
        console.log(res);
        this.router.navigate(['/tutorials']);
      },
      error: (e) => console.error(e)
    });
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

  private trimmedText(value?: string): string {
    return value?.trim() ?? '';
  }
}
