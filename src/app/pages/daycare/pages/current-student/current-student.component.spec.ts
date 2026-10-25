import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import {
  DayCareEnrollmentDto,
  EnrollmentStatus,
} from 'src/app/models/enrollment.model';
import { EnrollmentService } from 'src/app/services/enrollment.service';
import { CurrentStudentComponent } from './current-student.component';

describe('CurrentStudentComponent', () => {
  let component: CurrentStudentComponent;
  let fixture: ComponentFixture<CurrentStudentComponent>;
  let enrollmentService: jasmine.SpyObj<EnrollmentService>;
  const enrollments: DayCareEnrollmentDto[] = [
    {
      id: 1,
      child: {
        id: 8,
        firstName: 'Jamie',
        lastName: 'Lee',
        dob: '2020-06-12',
        sex: 'FEMALE',
      },
      status: EnrollmentStatus.COMPLETED,
      enrollmentDate: '2024-09-01',
      endDate: '2026-08-31',
      schedule: 'Weekdays',
    },
    {
      id: 2,
      child: {
        id: 9,
        firstName: 'Taylor',
        lastName: 'Morgan',
        dob: '2021-02-03',
        sex: 'MALE',
      },
      status: EnrollmentStatus.ACTIVE,
    },
  ];

  beforeEach(async () => {
    localStorage.setItem('userEmail', 'daycare@example.com');
    enrollmentService = jasmine.createSpyObj<EnrollmentService>(
      'EnrollmentService',
      ['getMyEnrollmentsByStatus'],
    );
    enrollmentService.getMyEnrollmentsByStatus.and.returnValue(of(enrollments));

    await TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [CurrentStudentComponent],
      providers: [{ provide: EnrollmentService, useValue: enrollmentService }],
    }).compileComponents();

    fixture = TestBed.createComponent(CurrentStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => localStorage.removeItem('userEmail'));

  it('loads and displays only completed enrolments with child details', () => {
    expect(enrollmentService.getMyEnrollmentsByStatus).toHaveBeenCalledWith(
      '',
      'daycare@example.com',
      EnrollmentStatus.COMPLETED,
    );
    expect(component.enrollments).toEqual([enrollments[0]]);
    expect(fixture.nativeElement.textContent).toContain('Jamie Lee');
    expect(fixture.nativeElement.textContent).toContain('FEMALE');
    expect(fixture.nativeElement.textContent).not.toContain('Taylor Morgan');
  });

  it('shows an error and retry button when enrolments fail to load', () => {
    enrollmentService.getMyEnrollmentsByStatus.and.returnValue(
      throwError(() => new Error('Request failed')),
    );

    component.loadCompletedEnrollments();
    fixture.detectChanges();

    expect(component.loading).toBeFalse();
    expect(component.errorMessage).toBe(
      'Unable to load completed enrollments. Please try again.',
    );
    expect(fixture.nativeElement.querySelector('.retry-button')).toBeTruthy();
  });
});
