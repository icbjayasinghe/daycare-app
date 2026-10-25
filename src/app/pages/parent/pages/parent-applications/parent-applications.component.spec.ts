import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import {
  ApplicationStatus,
  DayCareApplicationDto,
} from 'src/app/models/daycare-application.model';
import {
  DayCareEnrollmentDto,
  EnrollmentStatus,
} from 'src/app/models/enrollment.model';
import { DaycareDto, DaycareStatus } from 'src/app/models/daycare.model';
import { ApplicationService } from 'src/app/services/application.service';
import { EnrollmentService } from 'src/app/services/enrollment.service';
import { ParentApplicationsComponent } from './parent-applications.component';
import { ViewEnrollmentDialogComponent } from '../../dialog/view-enrollment-dialog/view-enrollment-dialog.component';

describe('ParentApplicationsComponent', () => {
  let component: ParentApplicationsComponent;
  let fixture: ComponentFixture<ParentApplicationsComponent>;
  let applicationService: jasmine.SpyObj<ApplicationService>;
  let enrollmentService: jasmine.SpyObj<EnrollmentService>;
  let dialog: jasmine.SpyObj<MatDialog>;

  const child = {
    id: 7,
    firstName: 'Alex',
    lastName: 'Smith',
    dob: '2020-01-01',
    sex: 'NOT_SPECIFIED',
  };
  const daycare: DaycareDto = {
    id: 2,
    name: 'Little Steps',
    telephone: '555-0100',
    owners: [],
    status: DaycareStatus.APPROVED,
    address: {
      apartment: '',
      address: '10 Main Street',
      city: 'Springfield',
      state: 'CA',
      postalCode: '90000',
      country: 'USA',
    },
  };
  const applications: DayCareApplicationDto[] = [
    {
      id: 1,
      child,
      dayCare: daycare,
      status: ApplicationStatus.PENDING,
      appliedAt: '2026-10-01T12:00:00Z',
    },
  ];
  const enrollments: DayCareEnrollmentDto[] = [
    {
      id: 3,
      child,
      daycare,
      status: EnrollmentStatus.ACTIVE,
      enrollmentDate: '2026-10-20',
      schedule: 'Weekdays',
    },
  ];

  beforeEach(async () => {
    localStorage.setItem('userEmail', 'parent@example.com');
    applicationService = jasmine.createSpyObj<ApplicationService>(
      'ApplicationService',
      ['getMyApplicationsByStatus'],
    );
    applicationService.getMyApplicationsByStatus.and.returnValue(
      of(applications),
    );
    enrollmentService = jasmine.createSpyObj<EnrollmentService>(
      'EnrollmentService',
      ['getMyEnrollmentsByStatus'],
    );
    enrollmentService.getMyEnrollmentsByStatus.and.returnValue(of(enrollments));
    dialog = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [CommonModule, MatTabsModule, NoopAnimationsModule],
      declarations: [ParentApplicationsComponent],
      providers: [
        { provide: ApplicationService, useValue: applicationService },
        { provide: EnrollmentService, useValue: enrollmentService },
        { provide: MatDialog, useValue: dialog },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ParentApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => localStorage.removeItem('userEmail'));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads parent applications and enrollments for the two tabs', async () => {
    await fixture.whenStable();
    fixture.detectChanges();

    expect(applicationService.getMyApplicationsByStatus).toHaveBeenCalledWith(
      'parent@example.com',
      '',
      '',
    );
    expect(enrollmentService.getMyEnrollmentsByStatus).toHaveBeenCalledWith(
      'parent@example.com',
      '',
      '',
    );
    expect(component.applications).toEqual(applications);
    expect(component.enrollments).toEqual(enrollments);
    expect(fixture.nativeElement.textContent).toContain('Applications');
    expect(fixture.nativeElement.textContent).toContain('Response Received');
    expect(fixture.nativeElement.textContent).toContain('Little Steps');
  });

  it('opens enrollment details in the view-enrollment dialog', () => {
    component.viewEnrollment(enrollments[0]);

    expect(dialog.open).toHaveBeenCalledWith(
      ViewEnrollmentDialogComponent,
      jasmine.objectContaining({
        data: enrollments[0],
      }),
    );
  });
});
