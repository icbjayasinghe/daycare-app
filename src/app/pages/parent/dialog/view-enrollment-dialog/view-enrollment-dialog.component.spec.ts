import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DayCareEnrollmentDto, EnrollmentStatus } from 'src/app/models/enrollment.model';
import { DaycareDto, DaycareStatus } from 'src/app/models/daycare.model';
import { ViewEnrollmentDialogComponent } from './view-enrollment-dialog.component';

describe('ViewEnrollmentDialogComponent', () => {
  let component: ViewEnrollmentDialogComponent;
  let fixture: ComponentFixture<ViewEnrollmentDialogComponent>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<ViewEnrollmentDialogComponent>>;

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

    await TestBed.configureTestingModule({
      imports: [CommonModule, MatDialogModule, NoopAnimationsModule],
      declarations: [ViewEnrollmentDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: enrollment },
        { provide: MatDialogRef, useValue: dialogRef },
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
  });

  it('closes the dialog', () => {
    component.close();

    expect(dialogRef.close).toHaveBeenCalled();
  });
});
