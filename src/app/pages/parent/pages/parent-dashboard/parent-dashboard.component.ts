import { Component, OnInit } from '@angular/core';
import {
  ApplicationStatus,
  DayCareApplicationDto,
} from 'src/app/models/daycare-application.model';
import {
  DayCareEnrollmentDto,
  EnrollmentStatus,
} from 'src/app/models/enrollment.model';
import { ApplicationService } from 'src/app/services/application.service';
import { EnrollmentService } from 'src/app/services/enrollment.service';

@Component({
  selector: 'app-parent-dashboard',
  templateUrl: './parent-dashboard.component.html',
  styleUrls: ['./parent-dashboard.component.css'],
})
export class ParentDashboardComponent implements OnInit {
  readonly parentEmail = localStorage.getItem('userEmail') || '';
  applications: DayCareApplicationDto[] = [];
  activeEnrollments: DayCareEnrollmentDto[] = [];
  loading = false;
  errorMessage = '';
  enrollmentsLoading = false;
  enrollmentsErrorMessage = '';

  constructor(
    private readonly applicationService: ApplicationService,
    private readonly enrollmentService: EnrollmentService,
  ) {}

  ngOnInit(): void {
    this.loadApplications();
    this.loadActiveEnrollments();
  }

  loadApplications(): void {
    if (!this.parentEmail) {
      this.errorMessage = 'Unable to identify the signed-in parent.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.applicationService
      .getMyApplicationsByStatus(this.parentEmail, '', '')
      .subscribe({
        next: (applications) => {
          this.applications = applications;
          this.loading = false;
        },
        error: () => {
          this.errorMessage =
            'Unable to load your daycare applications. Please try again.';
          this.loading = false;
        },
      });
  }

  loadActiveEnrollments(): void {
    if (!this.parentEmail) {
      this.enrollmentsErrorMessage =
        'Unable to identify the signed-in parent.';
      return;
    }

    this.enrollmentsLoading = true;
    this.enrollmentsErrorMessage = '';
    this.enrollmentService
      .getMyEnrollmentsByStatus(
        this.parentEmail,
        '',
        EnrollmentStatus.ACTIVE,
      )
      .subscribe({
        next: (enrollments) => {
          this.activeEnrollments = enrollments.filter(
            (enrollment) => enrollment.status === EnrollmentStatus.ACTIVE,
          );
          this.enrollmentsLoading = false;
        },
        error: () => {
          this.enrollmentsErrorMessage =
            'Unable to load your active daycare enrollments. Please try again.';
          this.enrollmentsLoading = false;
        },
      });
  }

  getStatusClass(status: ApplicationStatus): string {
    return `status-${status.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  }
}
