import { Component, OnInit } from '@angular/core';
import {
  ApplicationStatus,
  DayCareApplicationDto,
} from 'src/app/models/daycare-application.model';
import { ApplicationService } from 'src/app/services/application.service';
import { MatDialog } from '@angular/material/dialog';
import { ChildProfileComponent } from '../../dialog/child-profile/child-profile.component';
import { DayCareEnrollmentDto } from 'src/app/models/enrollment.model';
import { EnrollmentService } from 'src/app/services/enrollment.service';

interface StatusAction {
  label: string;
  status: ApplicationStatus;
  disabled?: boolean;
}

@Component({
  selector: 'app-wait-list',
  templateUrl: './wait-list.component.html',
  styleUrls: ['./wait-list.component.css'],
})
export class WaitListComponent implements OnInit {
  readonly ApplicationStatus = ApplicationStatus;
  readonly daycareEmail = localStorage.getItem('userEmail') || '';
  readonly applicationStatuses = [
    ApplicationStatus.PENDING,
    ApplicationStatus.WAITLISTED,
    ApplicationStatus.ACCEPTED,
    ApplicationStatus.REJECTED,
    ApplicationStatus.WITHDRAWN,
  ];
  readonly allStatuses = 'ALL' as const;
  selectedStatus: ApplicationStatus | 'ALL' = ApplicationStatus.PENDING;
  applications: DayCareApplicationDto[] = [];
  enrollments: DayCareEnrollmentDto[] = [];
  loading = false;
  enrollmentsLoading = false;
  errorMessage = '';
  enrollmentsErrorMessage = '';
  statusUpdateError = '';
  readonly updatingApplicationIds = new Set<number>();

  constructor(
    private readonly applicationService: ApplicationService,
    private readonly dialog: MatDialog,
    private readonly enrollmentService: EnrollmentService,
  ) {}

  ngOnInit(): void {
    this.loadApplications();
    this.loadEnrollments();
  }

  loadEnrollments(): void {
    if (!this.daycareEmail) {
      this.enrollmentsErrorMessage =
        'Unable to identify the signed-in daycare.';
      return;
    }

    this.enrollmentsLoading = true;
    this.enrollmentsErrorMessage = '';
    this.enrollmentService
      .getMyEnrollmentsByStatus('', this.daycareEmail, '')
      .subscribe({
        next: (enrollments) => {
          this.enrollments = enrollments;
          this.enrollmentsLoading = false;
        },
        error: () => {
          this.enrollmentsErrorMessage =
            'Unable to load daycare enrollments. Please try again.';
          this.enrollmentsLoading = false;
        },
      });
  }

  loadApplications(): void {
    if (!this.daycareEmail) {
      this.errorMessage = 'Unable to identify the signed-in daycare.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.applicationService
      .getMyApplicationsByStatus(
        '',
        this.daycareEmail,
        this.selectedStatus === this.allStatuses ? '' : this.selectedStatus,
      )
      .subscribe({
        next: (applications) => {
          this.applications = applications;
          this.loading = false;
        },
        error: () => {
          this.errorMessage =
            'Unable to load requested applications. Please try again.';
          this.loading = false;
        },
      });
  }

  onStatusChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    if (value === this.allStatuses) {
      this.selectedStatus = this.allStatuses;
    } else {
      const status = this.applicationStatuses.find(
        (candidate) => candidate === value,
      );
      if (!status) {
        return;
      }
      this.selectedStatus = status;
    }
    this.loadApplications();
  }

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  }

  openChildProfile(application: DayCareApplicationDto): void {
    this.dialog.open(ChildProfileComponent, {
      data: application.child,
      width: 'min(560px, 90vw)',
    });
  }

  getStatusActions(application: DayCareApplicationDto): StatusAction[] {
    switch (application.status) {
      case ApplicationStatus.PENDING:
        return [
          {
            label: 'WAITLIST',
            status: ApplicationStatus.WAITLISTED,
            disabled: false,
          },
          {
            label: 'REJECT',
            status: ApplicationStatus.REJECTED,
            disabled: false,
          },
        ];
      case ApplicationStatus.WAITLISTED:
        return [
          { label: 'ACCEPT', status: ApplicationStatus.ACCEPTED },
          {
            label: 'WAITLISTED',
            status: ApplicationStatus.WAITLISTED,
            disabled: true,
          },
          { label: 'REJECTED', status: ApplicationStatus.REJECTED },
        ];
      case ApplicationStatus.ACCEPTED:
        return [
          { label: 'ENROLL', status: ApplicationStatus.ENROLLED },
          {
            label: 'ACCEPT',
            status: ApplicationStatus.ACCEPTED,
            disabled: true,
          },
          { label: 'REJECT', status: ApplicationStatus.REJECTED },
        ];
      default:
        return [];
    }
  }

  updateStatus(
    application: DayCareApplicationDto,
    status: ApplicationStatus,
  ): void {
    console.log(
      `Updating application ID ${application.id} status from ${application.status} to ${status}`,
    );
    this.statusUpdateError = '';
    const applicationId = application.id;
    if (
      applicationId === undefined ||
      this.updatingApplicationIds.has(applicationId) ||
      application.status === ApplicationStatus.REJECTED ||
      application.status === status
    ) {
      return;
    }

    const previousStatus = application.status;
    this.statusUpdateError = '';
    this.updatingApplicationIds.add(applicationId);
    this.applicationService
      .updateApplicationStatus({ ...application, status })
      .subscribe({
        next: (savedApplication) => {
          application.status = savedApplication.status;
          this.updatingApplicationIds.delete(applicationId);
          if (
            this.selectedStatus !== this.allStatuses &&
            this.selectedStatus !== savedApplication.status
          ) {
            this.applications = this.applications.filter(
              (item) => item !== application,
            );
          }
        },
        error: () => {
          application.status = previousStatus;
          this.updatingApplicationIds.delete(applicationId);
          this.statusUpdateError =
            'Unable to update the application status. Please try again.';
        },
      });
  }
}
