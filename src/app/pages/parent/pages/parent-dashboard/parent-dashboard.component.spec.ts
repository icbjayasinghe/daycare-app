import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { DayCareApplicationDto } from 'src/app/models/daycare-application.model';
import { ApplicationService } from 'src/app/services/application.service';

import { ParentDashboardComponent } from './parent-dashboard.component';

describe('ParentDashboardComponent', () => {
  let component: ParentDashboardComponent;
  let fixture: ComponentFixture<ParentDashboardComponent>;
  let applicationService: jasmine.SpyObj<ApplicationService>;
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
      dayCare: {
        id: 2,
        name: 'Little Steps',
        telephone: '555-0100',
        owners: [],
        address: {
          apartment: '',
          address: '10 Main Street',
          city: 'Springfield',
          state: 'CA',
          postalCode: '90000',
          country: 'USA',
        },
      },
      status: 'PENDING',
      appliedAt: '2026-10-01T12:00:00Z',
    },
  ];

  beforeEach(async () => {
    localStorage.setItem('userEmail', 'parent@example.com');
    applicationService = jasmine.createSpyObj<ApplicationService>(
      'ApplicationService',
      ['getMyApplications'],
    );
    applicationService.getMyApplications.and.returnValue(of(applications));

    await TestBed.configureTestingModule({
      declarations: [ParentDashboardComponent],
      providers: [
        { provide: ApplicationService, useValue: applicationService },
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
    expect(applicationService.getMyApplications).toHaveBeenCalledWith(
      'parent@example.com',
      '',
    );
    expect(component.applications).toEqual(applications);
    expect(fixture.nativeElement.textContent).toContain('Little Steps');
    expect(fixture.nativeElement.textContent).toContain('Alex Smith');
    expect(fixture.nativeElement.textContent).toContain('PENDING');
  });

  it('shows an error if the applications cannot be loaded', () => {
    applicationService.getMyApplications.and.returnValue(
      throwError(() => new Error('Request failed')),
    );

    component.loadApplications();

    expect(component.loading).toBeFalse();
    expect(component.errorMessage).toBe(
      'Unable to load your daycare applications. Please try again.',
    );
  });
});
