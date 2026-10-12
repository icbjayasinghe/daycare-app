import { Component, OnInit } from '@angular/core';
import { DayCareApplicationDto } from 'src/app/models/daycare-application.model';
import { ApplicationService } from 'src/app/services/application.service';

@Component({
  selector: 'app-parent-dashboard',
  templateUrl: './parent-dashboard.component.html',
  styleUrls: ['./parent-dashboard.component.css'],
})
export class ParentDashboardComponent implements OnInit {
  readonly parentEmail = localStorage.getItem('userEmail') || '';
  applications: DayCareApplicationDto[] = [];
  loading = false;
  errorMessage = '';

  constructor(private readonly applicationService: ApplicationService) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    if (!this.parentEmail) {
      this.errorMessage = 'Unable to identify the signed-in parent.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.applicationService.getMyApplications(this.parentEmail, '').subscribe({
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

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  }
}
