import { Component, OnInit } from '@angular/core';
import {
  ApplicationStatus,
  DayCareApplicationDto,
} from 'src/app/models/daycare-application.model';
import { ApplicationService } from 'src/app/services/application.service';
import { MatDialog } from '@angular/material/dialog';
import { ChildProfileComponent } from '../../dialog/child-profile/child-profile.component';

@Component({
  selector: 'app-wait-list',
  templateUrl: './wait-list.component.html',
  styleUrls: ['./wait-list.component.css'],
})
export class WaitListComponent implements OnInit {
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
  loading = false;
  errorMessage = '';

  constructor(
    private readonly applicationService: ApplicationService,
    private readonly dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.loadApplications();
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

  getStatusClass(status: ApplicationStatus): string {
    return `status-${status.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  }

  openChildProfile(application: DayCareApplicationDto): void {
    this.dialog.open(ChildProfileComponent, {
      data: application.child,
      width: 'min(560px, 90vw)',
    });
  }
}
