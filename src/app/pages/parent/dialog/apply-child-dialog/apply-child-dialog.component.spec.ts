import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { ApplicationStatus } from 'src/app/models/daycare-application.model';
import { DaycareProfile } from 'src/app/models/daycare.model';
import { ChildDto } from 'src/app/models/parent.model';
import { ChildService } from 'src/app/services/child.service';
import { MaterialModule } from 'src/app/shared/material.module';

import { ApplyChildDialogComponent } from './apply-child-dialog.component';

describe('ApplyChildDialogComponent', () => {
  let component: ApplyChildDialogComponent;
  let fixture: ComponentFixture<ApplyChildDialogComponent>;
  let childService: jasmine.SpyObj<ChildService>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<ApplyChildDialogComponent>>;
  const daycare: DaycareProfile = {
    id: 12,
    name: 'Little Steps',
    telephone: '555-0100',
    website: 'https://littlesteps.example',
    owners: [],
    address: {
      apartment: '',
      address: '10 Main Street',
      city: 'Springfield',
      state: 'CA',
      postalCode: '90000',
      country: 'USA',
    },
  };
  const child: ChildDto = {
    id: 5,
    firstName: 'Alex',
    lastName: 'Smith',
    dob: '2020-01-01',
    sex: 'NOT_SPECIFIED',
  };

  beforeEach(async () => {
    localStorage.setItem('userEmail', 'parent@example.com');
    childService = jasmine.createSpyObj<ChildService>('ChildService', [
      'getMyChildren',
      'applyDaycare',
    ]);
    childService.getMyChildren.and.returnValue(of([child]));
    dialogRef = jasmine.createSpyObj<MatDialogRef<ApplyChildDialogComponent>>(
      'MatDialogRef',
      ['close'],
    );

    await TestBed.configureTestingModule({
      declarations: [ApplyChildDialogComponent],
      imports: [MaterialModule, NoopAnimationsModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: daycare },
        { provide: ChildService, useValue: childService },
        { provide: MatDialogRef, useValue: dialogRef },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ApplyChildDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => localStorage.removeItem('userEmail'));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads the parent children and defaults to portal application', () => {
    expect(childService.getMyChildren).toHaveBeenCalledWith(
      'parent@example.com',
    );
    expect(component.children).toEqual([child]);
    expect(component.applicationMethod).toBe('portal');
    expect(component.websiteUrl).toBe('https://littlesteps.example/');
  });

  it('requires a child before navigating to the review step', () => {
    component.goToStep(3);

    expect(component.currentStep).toBe(1);
    expect(component.errorMessage).toBe('Select a child before continuing.');
  });

  it('submits a portal application and closes on success', () => {
    childService.applyDaycare.and.returnValue(of({}));
    component.selectChild(child);
    component.goToStep(3);

    component.apply();

    expect(childService.applyDaycare).toHaveBeenCalledWith(
      'parent@example.com',
      12,
      {
        child,
        dayCare: daycare,
        status: ApplicationStatus.PENDING,
      },
    );
    expect(dialogRef.close).toHaveBeenCalledWith({
      child,
      dayCare: daycare,
      status: ApplicationStatus.PENDING,
    });
  });

  it('shows an error and keeps the wizard open when submission fails', () => {
    childService.applyDaycare.and.returnValue(
      throwError(() => new Error('Request failed')),
    );
    component.selectChild(child);

    component.apply();

    expect(component.saving).toBeFalse();
    expect(component.errorMessage).toBe(
      'Unable to submit your application. Please try again.',
    );
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('opens the daycare website when website application is selected', () => {
    const openSpy = spyOn(window, 'open').and.returnValue(null);
    component.applicationMethod = 'website';
    component.selectChild(child);

    component.apply();

    expect(openSpy).toHaveBeenCalledWith(
      'https://littlesteps.example/',
      '_blank',
      'noopener,noreferrer',
    );
    expect(childService.applyDaycare).not.toHaveBeenCalled();
  });
});
