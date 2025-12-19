import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { TutorialService } from 'src/app/services/tutorial.service';
import { TutorialsListComponent } from './tutorials-list.component';

describe('TutorialsListComponent', () => {
  let component: TutorialsListComponent;
  let fixture: ComponentFixture<TutorialsListComponent>;
  let tutorialService: jasmine.SpyObj<TutorialService>;
  let authService: jasmine.SpyObj<AuthService>;
  const tutorials = [
    { id: 1, title: 'Berlin', description: 'Capital', published: true },
    { id: 2, title: 'Hamburg', description: 'Harbor', published: false },
  ];

  beforeEach(() => {
    tutorialService = jasmine.createSpyObj<TutorialService>('TutorialService', ['getAll', 'deleteAll', 'findByTitle']);
    tutorialService.getAll.and.returnValue(of(tutorials));
    tutorialService.deleteAll.and.returnValue(of({}));
    tutorialService.findByTitle.and.returnValue(of([tutorials[0]]));

    authService = jasmine.createSpyObj<AuthService>('AuthService', ['isAuthenticated']);
    authService.isAuthenticated.and.returnValue(true);

    TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, RouterTestingModule],
      declarations: [TutorialsListComponent],
      providers: [
        { provide: TutorialService, useValue: tutorialService },
        { provide: AuthService, useValue: authService },
      ],
    });
    fixture = TestBed.createComponent(TutorialsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load tutorials on init', () => {
    expect(tutorialService.getAll).toHaveBeenCalled();
    expect(component.tutorials).toEqual(tutorials);
  });

  it('should trim search title before querying', () => {
    component.title = '  Berlin ';
    component.searchTitle();
    expect(tutorialService.findByTitle).toHaveBeenCalledWith('Berlin');
  });

  it('should avoid deletion when user is not authenticated', () => {
    authService.isAuthenticated.and.returnValue(false);
    component.removeAllTutorials();
    expect(tutorialService.deleteAll).not.toHaveBeenCalled();
  });
});
