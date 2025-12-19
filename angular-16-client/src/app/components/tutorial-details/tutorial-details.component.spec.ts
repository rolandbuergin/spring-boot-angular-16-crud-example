import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { TutorialService } from 'src/app/services/tutorial.service';
import { TutorialDetailsComponent } from './tutorial-details.component';

describe('TutorialDetailsComponent', () => {
  let component: TutorialDetailsComponent;
  let fixture: ComponentFixture<TutorialDetailsComponent>;
  let tutorialService: jasmine.SpyObj<TutorialService>;
  let authService: jasmine.SpyObj<AuthService>;
  const tutorial = {
    id: '42',
    title: 'Berlin',
    description: 'Capital city',
    einwohner: 3800000,
    published: false,
  };

  beforeEach(() => {
    tutorialService = jasmine.createSpyObj<TutorialService>('TutorialService', ['get', 'update', 'delete']);
    tutorialService.get.and.returnValue(of(tutorial));
    tutorialService.update.and.returnValue(of({ message: 'updated' }));
    tutorialService.delete.and.returnValue(of({}));

    authService = jasmine.createSpyObj<AuthService>('AuthService', ['isAuthenticated']);
    authService.isAuthenticated.and.returnValue(true);

    TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, RouterTestingModule],
      declarations: [TutorialDetailsComponent],
      providers: [
        { provide: TutorialService, useValue: tutorialService },
        { provide: AuthService, useValue: authService },
        { provide: ActivatedRoute, useValue: { snapshot: { params: { id: tutorial.id } } } },
      ],
    });
    fixture = TestBed.createComponent(TutorialDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load tutorial on init when viewMode is false', () => {
    expect(tutorialService.get).toHaveBeenCalledWith(tutorial.id);
    expect(component.currentTutorial.title).toBe('Berlin');
  });

  it('should prevent publishing when user is not authenticated', () => {
    authService.isAuthenticated.and.returnValue(false);
    component.updatePublished(true);

    expect(component.errorMessage).toContain('Bitte melden Sie sich als Redakteur');
    expect(tutorialService.update).not.toHaveBeenCalled();
  });

  it('should trim title and description before updating', () => {
    tutorialService.update.calls.reset();
    component.currentTutorial = {
      ...tutorial,
      title: ' Berlin ',
      description: ' Hauptstadt ',
    };
    const form = { invalid: false } as NgForm;

    component.updateTutorial(form);

    expect(tutorialService.update).toHaveBeenCalledWith(tutorial.id, {
      ...tutorial,
      title: 'Berlin',
      description: 'Hauptstadt',
    });
  });
});
