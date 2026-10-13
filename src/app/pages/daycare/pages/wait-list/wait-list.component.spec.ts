import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { of, throwError } from 'rxjs';
import {
  ApplicationStatus,
  DayCareApplicationDto,
} from 'src/app/models/daycare-application.model';
import { ApplicationService } from 'src/app/services/application.service';

import { WaitListComponent } from './wait-list.component';

describe('WaitListComponent', () => {
  let component: WaitListComponent;
  let fixture: ComponentFixture<WaitListComponent>;
  let applicationService: jasmine.SpyObj<ApplicationService>;
  const applications: DayCareApplicationDto[] = [
    {
      id: 12,
      child: {
        id: 4,
        firstName: 'Sam',
        lastName: 'Jones',
        dob: '2021-03-15',
        sex: 'FEMALE',
      },
      dayCare: {
        id: 7,
        name: 'Bright Start',
        telephone: '555-0140',
        owners: [],
        address: {
          apartment: '',
          address: '20 Oak Road',
          city: 'Springfield',
          state: 'CA',
          postalCode: '90000',
          country: 'USA',
        },
      },
      status: ApplicationStatus.PENDING,
      appliedAt: '2026-10-10T12:00:00Z',
    },
  ];

  beforeEach(async () => {
    localStorage.setItem('userEmail', 'daycare@example.com');
    applicationService = jasmine.createSpyObj<ApplicationService>(
      'ApplicationService',
      ['getMyApplicationsByStatus'],
    );
    applicationService.getMyApplicationsByStatus.and.returnValue(
      of(applications),
    );

    await TestBed.configureTestingModule({
      declarations: [WaitListComponent],
      imports: [CommonModule],
      providers: [
        { provide: ApplicationService, useValue: applicationService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WaitListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => localStorage.removeItem('userEmail'));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads applications for the signed-in daycare and displays their status', () => {
    expect(applicationService.getMyApplicationsByStatus).toHaveBeenCalledWith(
      '',
      'daycare@example.com',
      ApplicationStatus.PENDING,
    );
    expect(component.applications).toEqual(applications);
    expect(fixture.nativeElement.textContent).toContain('Sam Jones');
    expect(fixture.nativeElement.textContent).toContain('PENDING');
  });

  it('shows an error when requested applications fail to load', () => {
    applicationService.getMyApplicationsByStatus.and.returnValue(
      throwError(() => new Error('Request failed')),
    );

    component.loadApplications();

    expect(component.loading).toBeFalse();
    expect(component.errorMessage).toBe(
      'Unable to load requested applications. Please try again.',
    );
  });

  it('reloads applications for the selected status', () => {
    const select = document.createElement('select');
    const option = document.createElement('option');
    option.value = ApplicationStatus.ACCEPTED;
    select.appendChild(option);
    select.value = ApplicationStatus.ACCEPTED;
    const changeEvent = new Event('change');
    Object.defineProperty(changeEvent, 'target', { value: select });
    applicationService.getMyApplicationsByStatus.calls.reset();

    component.onStatusChange(changeEvent);

    expect(component.selectedStatus).toBe(ApplicationStatus.ACCEPTED);
    expect(applicationService.getMyApplicationsByStatus).toHaveBeenCalledWith(
      '',
      'daycare@example.com',
      ApplicationStatus.ACCEPTED,
    );
  });

  it('requests all applications when the all filter is selected', () => {
    const select = document.createElement('select');
    const option = document.createElement('option');
    option.value = 'ALL';
    select.appendChild(option);
    select.value = 'ALL';
    const changeEvent = new Event('change');
    Object.defineProperty(changeEvent, 'target', { value: select });
    applicationService.getMyApplicationsByStatus.calls.reset();

    component.onStatusChange(changeEvent);

    expect(component.selectedStatus).toBe('ALL');
    expect(applicationService.getMyApplicationsByStatus).toHaveBeenCalledWith(
      '',
      'daycare@example.com',
      '',
    );
  });
});
