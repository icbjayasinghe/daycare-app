import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginResponse } from 'src/app/models/login-response.model';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { AdminLoginComponent } from './admin-login.component';

describe('AdminLoginComponent', () => {
  let component: AdminLoginComponent;
  let fixture: ComponentFixture<AdminLoginComponent>;
  let authService: jasmine.SpyObj<AuthServiceService>;
  let router: jasmine.SpyObj<Router>;
  const loginResponse: LoginResponse = { accessToken: 'admin-token' };

  beforeEach(async () => {
    authService = jasmine.createSpyObj<AuthServiceService>(
      'AuthServiceService',
      ['login', 'establishAdminSession'],
    );
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);
    router.navigate.and.returnValue(Promise.resolve(true));

    await TestBed.configureTestingModule({
      declarations: [AdminLoginComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AuthServiceService, useValue: authService },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('requires a valid email and password', () => {
    component.onSubmit();

    expect(component.loginForm.invalid).toBeTrue();
    expect(authService.login).not.toHaveBeenCalled();
  });

  it('authenticates an admin and redirects to the admin dashboard', () => {
    authService.login.and.returnValue(of(loginResponse));
    authService.establishAdminSession.and.returnValue(true);
    component.loginForm.setValue({
      email: 'admin@example.com',
      password: 'secret',
    });

    component.onSubmit();

    expect(authService.login).toHaveBeenCalledWith(
      'admin@example.com',
      'secret',
    );
    expect(authService.establishAdminSession).toHaveBeenCalledWith(
      loginResponse,
      'admin@example.com',
    );
    expect(router.navigate).toHaveBeenCalledWith(['/pages/admin/dashboard']);
    expect(component.loading).toBeFalse();
  });

  it('shows an access error when the account is not an admin', () => {
    authService.login.and.returnValue(of(loginResponse));
    authService.establishAdminSession.and.returnValue(false);
    component.loginForm.setValue({
      email: 'parent@example.com',
      password: 'secret',
    });

    component.onSubmit();

    expect(component.loginError).toBe(
      'This account does not have administrator access.',
    );
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('shows a login error when authentication fails', () => {
    authService.login.and.returnValue(
      throwError(() => new Error('Request failed')),
    );
    component.loginForm.setValue({
      email: 'admin@example.com',
      password: 'wrong-password',
    });

    component.onSubmit();

    expect(component.loading).toBeFalse();
    expect(component.loginError).toBe('Invalid email or password.');
  });
});
