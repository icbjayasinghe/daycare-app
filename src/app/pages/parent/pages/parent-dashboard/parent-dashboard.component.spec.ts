import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
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

import { ParentDashboardComponent } from './parent-dashboard.component';

describe('ParentDashboardComponent', () => {
  let component: ParentDashboardComponent;
  let fixture: ComponentFixture<ParentDashboardComponent>;
  let applicationService: jasmine.SpyObj<ApplicationService>;
  let enrollmentService: jasmine.SpyObj<EnrollmentService>;
  const daycare: DaycareDto = {
    id: 2,
    name: 'Little Steps',
    telephone: '555-0100',
    status: DaycareStatus.APPROVED,
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
  const applications: DayCareApplicationDto[] = [
    {
      id: 1,
      child: {
        id: 7,
        firstName: 'Alex',
        lastName: 'Smith',
        dob: '2020-01-01',
        sex: 'NOT_SPECIFIED',
      },
      dayCare: daycare,
      status: ApplicationStatus.PENDING,
      appliedAt: '2026-10-01T12:00:00Z',
    },
  ];
  const enrollments: DayCareEnrollmentDto[] = [
    {
      id: 1,
      child: applications[0].child,
      daycare,
      status: EnrollmentStatus.ACTIVE,
      enrollmentDate: '2026-10-20',
      schedule: 'Monday-Friday, 8:00 AM - 5:00 PM',
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

    await TestBed.configureTestingModule({
      declarations: [ParentDashboardComponent],
      providers: [
        { provide: ApplicationService, useValue: applicationService },
        { provide: EnrollmentService, useValue: enrollmentService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ParentDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => localStorage.removeItem('userEmail'));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads and displays daycare application statuses', () => {
    expect(applicationService.getMyApplicationsByStatus).toHaveBeenCalledWith(
      'parent@example.com',
      '',
      '',
    );
    expect(component.applications).toEqual(applications);
    expect(fixture.nativeElement.textContent).toContain('Little Steps');
    expect(fixture.nativeElement.textContent).toContain('Alex Smith');
    expect(fixture.nativeElement.textContent).toContain('PENDING');
  });

  it('loads and displays active enrollments with a congratulations message', () => {
    expect(enrollmentService.getMyEnrollmentsByStatus).toHaveBeenCalledWith(
      'parent@example.com',
      '',
      EnrollmentStatus.ACTIVE,
    );
    expect(component.activeEnrollments).toEqual(enrollments);
    expect(fixture.nativeElement.textContent).toContain('Congratulations!');
    expect(fixture.nativeElement.textContent).toContain(
      'Monday-Friday, 8:00 AM - 5:00 PM',
    );
  });

  it('does not show the active-enrollment section when none are active', () => {
    enrollmentService.getMyEnrollmentsByStatus.and.returnValue(of([]));

    component.loadActiveEnrollments();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).not.toContain(
      'Congratulations!',
    );
    expect(fixture.nativeElement.textContent).not.toContain(
      'Your active enrollments',
    );
  });

  it('shows an error if active enrollments cannot be loaded', () => {
    enrollmentService.getMyEnrollmentsByStatus.and.returnValue(
      throwError(() => new Error('Request failed')),
    );

    component.loadActiveEnrollments();
    fixture.detectChanges();

    expect(component.enrollmentsLoading).toBeFalse();
    expect(component.enrollmentsErrorMessage).toBe(
      'Unable to load your active daycare enrollments. Please try again.',
    );
    expect(fixture.nativeElement.textContent).toContain(
      component.enrollmentsErrorMessage,
    );
  });

  it('shows an error if the applications cannot be loaded', () => {
    applicationService.getMyApplicationsByStatus.and.returnValue(
      throwError(() => new Error('Request failed')),
    );

    component.loadApplications();

    expect(component.loading).toBeFalse();
    expect(component.errorMessage).toBe(
      'Unable to load your daycare applications. Please try again.',
    );
  });
});
