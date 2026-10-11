import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { ParentService } from 'src/app/services/parent.service';
import { MaterialModule } from 'src/app/shared/material.module';
import { ParentSignupDialogComponent } from './parent-signup-dialog.component';

describe('ParentSignupDialogComponent', () => {
  let component: ParentSignupDialogComponent;
  let fixture: ComponentFixture<ParentSignupDialogComponent>;
  let parentService: jasmine.SpyObj<ParentService>;

  beforeEach(async () => {
    parentService = jasmine.createSpyObj<ParentService>('ParentService', [
      'registerParent',
    ]);
    parentService.registerParent.and.returnValue(
      of({
        firstName: 'Alex',
        lastName: 'Smith',
        email: 'parent@example.com',
        password: 'securepass',
      }),
    );

    await TestBed.configureTestingModule({
      declarations: [ParentSignupDialogComponent],
      imports: [
        CommonModule,
        ReactiveFormsModule,
        MaterialModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: ParentService, useValue: parentService },
        {
          provide: AuthServiceService,
          useValue: jasmine.createSpyObj<AuthServiceService>(
            'AuthServiceService',
            ['login', 'establishParentSession'],
          ),
        },
        { provide: Router, useValue: jasmine.createSpyObj<Router>('Router', ['navigate']) },
        {
          provide: MatDialogRef,
          useValue: jasmine.createSpyObj<MatDialogRef<ParentSignupDialogComponent>>(
            'MatDialogRef',
            ['close'],
          ),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ParentSignupDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('selects the parent sign-in tab and displays a success message after registration', () => {
    component.signupForm.setValue({
      firstName: 'Alex',
      lastName: 'Smith',
      email: 'parent@example.com',
      phone: '1234567890',
      password: 'securepass',
      address: '123 Main Street',
      apartment: '',
      city: 'Halifax',
      state: 'Nova Scotia',
      postalCode: 'B3H2Y5',
    });

    component.onSubmit();

    expect(parentService.registerParent).toHaveBeenCalled();
    expect(component.selectedTabIndex).toBe(0);
    expect(component.loginForm.get('email')?.value).toBe('parent@example.com');
    expect(component.signupSuccess).toBe(
      'Successfully registered as a parent. Please sign in.',
    );
  });

  it('shows an error when registration fails', () => {
    parentService.registerParent.and.returnValue(
      throwError(() => new Error('Request failed')),
    );
    component.signupForm.setValue({
      firstName: 'Alex',
      lastName: 'Smith',
      email: 'parent@example.com',
      phone: '1234567890',
      password: 'securepass',
      address: '123 Main Street',
      apartment: '',
      city: 'Halifax',
      state: 'Nova Scotia',
      postalCode: 'B3H2Y5',
    });

    component.onSubmit();

    expect(component.signupError).toBe('Unable to register. Please try again.');
    expect(component.selectedTabIndex).toBe(0);
  });
});
