import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { AuthService } from './services/auth.service';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    authService = jasmine.createSpyObj<AuthService>('AuthService', ['isAuthenticated', 'getUsername', 'logout']);
    authService.isAuthenticated.and.returnValue(true);
    authService.getUsername.and.returnValue('demo-editor');

    TestBed.configureTestingModule({
      imports: [CommonModule, RouterTestingModule],
      declarations: [AppComponent],
      providers: [{ provide: AuthService, useValue: authService }],
    });

    fixture = TestBed.createComponent(AppComponent);
  });

  it('should create the app', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should expose the configured title', () => {
    expect(fixture.componentInstance.title).toEqual('Angular 16 Crud example');
  });

  it('should render navbar brand and authenticated user name', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.navbar-brand')?.textContent).toContain('CityScapes');
    expect(compiled.querySelector('.navbar-text')?.textContent).toContain('demo-editor');
  });

  it('should trigger logout through the auth service', () => {
    fixture.componentInstance.logout();
    expect(authService.logout).toHaveBeenCalled();
  });
});
