import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import {
  ApplicationStatus,
  DayCareApplicationDto,
} from 'src/app/models/daycare-application.model';
import { ApplicationService } from 'src/app/services/application.service';
import { MaterialModule } from 'src/app/shared/material.module';

import { ChildProfileComponent } from '../../dialog/child-profile/child-profile.component';
import { WaitListComponent } from './wait-list.component';

describe('WaitListComponent', () => {
  let component: WaitListComponent;
  let fixture: ComponentFixture<WaitListComponent>;
  let applicationService: jasmine.SpyObj<ApplicationService>;
  let dialog: jasmine.SpyObj<MatDialog>;
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
    applications[0].status = ApplicationStatus.PENDING;
    localStorage.setItem('userEmail', 'daycare@example.com');
    applicationService = jasmine.createSpyObj<ApplicationService>(
      'ApplicationService',
      ['getMyApplicationsByStatus', 'updateApplicationStatus'],
    );
    applicationService.getMyApplicationsByStatus.and.returnValue(
      of(applications),
    );
    applicationService.updateApplicationStatus.and.callFake((application) =>
      of(application),
    );
    dialog = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      declarations: [WaitListComponent],
      imports: [CommonModule, MaterialModule],
      providers: [
        { provide: ApplicationService, useValue: applicationService },
        { provide: MatDialog, useValue: dialog },
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

  it('opens the child profile dialog with the selected application child', () => {
    component.openChildProfile(applications[0]);

    expect(dialog.open).toHaveBeenCalledWith(
      ChildProfileComponent,
      jasmine.objectContaining({ data: applications[0].child }),
    );
  });

  it('provides status actions for pending, waitlisted, and accepted applications', () => {
    expect(
      component
        .getStatusActions(applications[0])
        .map((action) => action.label),
    ).toEqual(['WAITLIST', 'REJECT']);

    applications[0].status = ApplicationStatus.WAITLISTED;
    expect(
      component
        .getStatusActions(applications[0])
        .map((action) => action.label),
    ).toEqual(['ACCEPT', 'WAITLISTED', 'REJECTED']);

    applications[0].status = ApplicationStatus.ACCEPTED;
    expect(
      component
        .getStatusActions(applications[0])
        .map((action) => action.label),
    ).toEqual(['ENROLL', 'ACCEPT', 'REJECT']);
  });

  it('does not offer actions for rejected applications', () => {
    applications[0].status = ApplicationStatus.REJECTED;

    expect(component.getStatusActions(applications[0])).toEqual([]);
  });

  it('clicking a status action submits the selected status', () => {
    fixture.detectChanges();
    const waitlistButton = Array.from(
      fixture.nativeElement.querySelectorAll(
        '.status-action-button',
      ) as NodeListOf<HTMLButtonElement>,
    ).find((button) => button.textContent?.trim() === 'WAITLIST');

    expect(waitlistButton).toBeTruthy();
    waitlistButton?.click();

    expect(applicationService.updateApplicationStatus).toHaveBeenCalledWith(
      jasmine.objectContaining({ status: ApplicationStatus.WAITLISTED }),
    );
  });

  it('updates application status and removes it from the selected status filter', () => {
    component.updateStatus(applications[0], ApplicationStatus.WAITLISTED);

    expect(applicationService.updateApplicationStatus).toHaveBeenCalledWith(
      jasmine.objectContaining({
        id: 12,
        status: ApplicationStatus.WAITLISTED,
      }),
    );
    expect(applications[0].status).toBe(ApplicationStatus.WAITLISTED);
    expect(component.applications).not.toContain(applications[0]);
  });

  it('keeps the existing status and displays an error when update fails', () => {
    applicationService.updateApplicationStatus.and.returnValue(
      throwError(() => new Error('Request failed')),
    );

    component.updateStatus(applications[0], ApplicationStatus.REJECTED);

    expect(applications[0].status).toBe(ApplicationStatus.PENDING);
    expect(component.statusUpdateError).toBe(
      'Unable to update the application status. Please try again.',
    );
    expect(component.updatingApplicationIds.size).toBe(0);
  });
});
