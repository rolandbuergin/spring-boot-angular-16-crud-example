import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { TutorialService } from 'src/app/services/tutorial.service';
import { AddTutorialComponent } from './add-tutorial.component';

describe('AddTutorialComponent', () => {
  let component: AddTutorialComponent;
  let fixture: ComponentFixture<AddTutorialComponent>;
  let tutorialService: jasmine.SpyObj<TutorialService>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    tutorialService = jasmine.createSpyObj<TutorialService>('TutorialService', ['create']);
    tutorialService.create.and.returnValue(of({}));

    authService = jasmine.createSpyObj<AuthService>('AuthService', ['isAuthenticated']);
    authService.isAuthenticated.and.returnValue(true);

    TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule],
      declarations: [AddTutorialComponent],
      providers: [
        { provide: TutorialService, useValue: tutorialService },
        { provide: AuthService, useValue: authService },
      ],
    });
    fixture = TestBed.createComponent(AddTutorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit trimmed tutorial data when authenticated', () => {
    component.tutorial = {
      title: ' Berlin ',
      description: ' Hauptstadt ',
      einwohner: 100,
      published: false,
    };
    const form = { invalid: false } as NgForm;

    component.saveTutorial(form);

    expect(tutorialService.create).toHaveBeenCalledWith({
      title: 'Berlin',
      description: 'Hauptstadt',
      einwohner: 100,
    });
    expect(component.submitted).toBeTrue();
    expect(component.errorMessage).toBe('');
  });

  it('should block submission when user is not authenticated', () => {
    authService.isAuthenticated.and.returnValue(false);
    const form = { invalid: false } as NgForm;

    component.saveTutorial(form);

    expect(component.errorMessage).toContain('Bitte melden Sie sich als Redakteur');
    expect(tutorialService.create).not.toHaveBeenCalled();
  });

  it('should surface backend validation errors', () => {
    tutorialService.create.and.returnValue(throwError(() => ({ error: { title: 'Titel fehlt.' } })));
    const form = { invalid: false } as NgForm;

    component.saveTutorial(form);

    expect(component.errorMessage).toContain('Titel fehlt.');
    expect(component.submitted).toBeFalse();
  });
});
