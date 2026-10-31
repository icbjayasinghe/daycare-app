import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { MaterialModule } from 'src/app/shared/material.module';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authenticated$: BehaviorSubject<boolean>;

  beforeEach(async () => {
    authenticated$ = new BehaviorSubject<boolean>(true);
    const authService = {
      authenticated$,
      profile$: new BehaviorSubject({
        givenName: 'Alex',
        familyName: 'Smith',
        role: 'PARENT',
      }),
      logout: jasmine.createSpy('logout'),
    };

    await TestBed.configureTestingModule({
      imports: [CommonModule, MaterialModule, NoopAnimationsModule],
      declarations: [HeaderComponent],
      providers: [
        { provide: AuthServiceService, useValue: authService },
        { provide: MatDialog, useValue: jasmine.createSpyObj('MatDialog', ['open']) },
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows the notification icon when the user is logged in', () => {
    expect(
      fixture.nativeElement.querySelector('.notification-icon'),
    ).toBeTruthy();
  });

  it('hides the notification icon when the user is logged out', () => {
    authenticated$.next(false);
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('.notification-icon'),
    ).toBeNull();
  });
});
