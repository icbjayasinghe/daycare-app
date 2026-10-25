import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  DayCareApplicationDto,
} from 'src/app/models/daycare-application.model';
import { DayCareEnrollmentDto } from 'src/app/models/enrollment.model';
import { ApplicationService } from 'src/app/services/application.service';
import { EnrollmentService } from 'src/app/services/enrollment.service';
import { ViewEnrollmentDialogComponent } from '../../dialog/view-enrollment-dialog/view-enrollment-dialog.component';

@Component({
  selector: 'app-parent-applications',
  templateUrl: './parent-applications.component.html',
  styleUrls: ['./parent-applications.component.css'],
})
export class ParentApplicationsComponent implements OnInit {
  readonly parentEmail = localStorage.getItem('userEmail') || '';
  applications: DayCareApplicationDto[] = [];
  enrollments: DayCareEnrollmentDto[] = [];
  applicationsLoading = false;
  enrollmentsLoading = false;
  applicationsError = '';
  enrollmentsError = '';

  constructor(
    private readonly applicationService: ApplicationService,
    private readonly enrollmentService: EnrollmentService,
    private readonly dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.loadApplications();
    this.loadEnrollments();
  }

  loadApplications(): void {
    if (!this.parentEmail) {
      this.applicationsError = 'Unable to identify the signed-in parent.';
      return;
    }

    this.applicationsLoading = true;
    this.applicationsError = '';
    this.applicationService
      .getMyApplicationsByStatus(this.parentEmail, '', '')
      .subscribe({
        next: (applications) => {
          this.applications = applications;
          this.applicationsLoading = false;
        },
        error: () => {
          this.applicationsError =
            'Unable to load your daycare applications. Please try again.';
          this.applicationsLoading = false;
        },
      });
  }

  loadEnrollments(): void {
    if (!this.parentEmail) {
      this.enrollmentsError = 'Unable to identify the signed-in parent.';
      return;
    }

    this.enrollmentsLoading = true;
    this.enrollmentsError = '';
    this.enrollmentService
      .getMyEnrollmentsByStatus(this.parentEmail, '', '')
      .subscribe({
        next: (enrollments) => {
          this.enrollments = enrollments;
          this.enrollmentsLoading = false;
        },
        error: () => {
          this.enrollmentsError =
            'Unable to load your daycare enrollments. Please try again.';
          this.enrollmentsLoading = false;
        },
      });
  }

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  }

  viewEnrollment(enrollment: DayCareEnrollmentDto): void {
    this.dialog.open(ViewEnrollmentDialogComponent, {
      width: '600px',
      maxWidth: '95vw',
      data: enrollment,
    });
  }
}
