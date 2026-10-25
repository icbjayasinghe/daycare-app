import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DomSanitizer } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { DayCareEnrollmentDto, EnrollmentStatus } from 'src/app/models/enrollment.model';
import { DaycareDto, DaycareStatus } from 'src/app/models/daycare.model';
import { EnrollmentService } from 'src/app/services/enrollment.service';
import { ViewEnrollmentDialogComponent } from './view-enrollment-dialog.component';

describe('ViewEnrollmentDialogComponent', () => {
  let component: ViewEnrollmentDialogComponent;
  let fixture: ComponentFixture<ViewEnrollmentDialogComponent>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<ViewEnrollmentDialogComponent>>;
  let enrollmentService: jasmine.SpyObj<EnrollmentService>;

  const daycare: DaycareDto = {
    id: 2,
    name: 'Little Steps',
    telephone: '555-0100',
    website: 'https://littlesteps.example',
    owners: [],
    status: DaycareStatus.APPROVED,
    address: {
      apartment: '2A',
      address: '10 Main Street',
      city: 'Springfield',
      state: 'CA',
      postalCode: '90000',
      country: 'USA',
      latitude: 37.7749,
      longitude: -122.4194,
    },
  };
  const enrollment: DayCareEnrollmentDto = {
    id: 3,
    child: {
      id: 7,
      firstName: 'Alex',
      lastName: 'Smith',
      dob: '2020-01-01',
      sex: 'NOT_SPECIFIED',
    },
    daycare,
    status: EnrollmentStatus.ACTIVE,
    enrollmentDate: '2026-10-20',
    schedule: 'Weekdays',
  };

  beforeEach(async () => {
    dialogRef = jasmine.createSpyObj<MatDialogRef<ViewEnrollmentDialogComponent>>(
      'MatDialogRef',
      ['close'],
    );
    enrollmentService = jasmine.createSpyObj<EnrollmentService>(
      'EnrollmentService',
      ['updateEnrollment'],
    );
    enrollmentService.updateEnrollment.and.returnValue(of(enrollment));

    await TestBed.configureTestingModule({
      imports: [CommonModule, MatDialogModule, NoopAnimationsModule],
      declarations: [ViewEnrollmentDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: enrollment },
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: EnrollmentService, useValue: enrollmentService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewEnrollmentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('shows enrollment and daycare details', () => {
    expect(fixture.nativeElement.textContent).toContain('Alex Smith');
    expect(fixture.nativeElement.textContent).toContain('Little Steps');
    expect(fixture.nativeElement.textContent).toContain(
      '2A, 10 Main Street, Springfield, CA, 90000, USA',
    );
    expect(fixture.nativeElement.textContent).toContain('Weekdays');
    expect(component.mapQuery).toBe('37.7749,-122.4194');
    expect(fixture.nativeElement.querySelector('iframe')).toBeTruthy();
  });

  it('uses the daycare address when coordinates are unavailable', () => {
    const addressEnrollment = {
      ...enrollment,
      daycare: {
        ...daycare,
        address: { ...daycare.address, latitude: undefined, longitude: undefined },
      },
    };
    component = new ViewEnrollmentDialogComponent(
      addressEnrollment,
      dialogRef,
      TestBed.inject(DomSanitizer),
      enrollmentService,
    );

    expect(component.mapQuery).toBe(
      '2A, 10 Main Street, Springfield, CA, 90000, USA',
    );
  });

  it('closes the dialog', () => {
    component.close();

    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('updates status to COMPLETED when accepted', () => {
    component.updateStatus(EnrollmentStatus.COMPLETED);

    expect(enrollmentService.updateEnrollment).toHaveBeenCalledWith({
      ...enrollment,
      status: EnrollmentStatus.COMPLETED,
    });
    expect(dialogRef.close).toHaveBeenCalledWith(enrollment);
  });

  it('updates status to WITHDRAWN when declined', () => {
    component.updateStatus(EnrollmentStatus.WITHDRAWN);

    expect(enrollmentService.updateEnrollment).toHaveBeenCalledWith({
      ...enrollment,
      status: EnrollmentStatus.WITHDRAWN,
    });
  });

  it('shows an error and leaves the dialog open when an update fails', () => {
    enrollmentService.updateEnrollment.and.returnValue(
      throwError(() => new Error('Request failed')),
    );

    component.updateStatus(EnrollmentStatus.COMPLETED);

    expect(component.saving).toBeFalse();
    expect(component.errorMessage).toBe(
      'Unable to update the enrollment status. Please try again.',
    );
    expect(dialogRef.close).not.toHaveBeenCalled();
  });
});
