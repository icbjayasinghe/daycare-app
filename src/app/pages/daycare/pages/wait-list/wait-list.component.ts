import { Component, OnInit } from '@angular/core';
import { DayCareApplicationDto } from 'src/app/models/daycare-application.model';
import { ApplicationService } from 'src/app/services/application.service';

@Component({
  selector: 'app-wait-list',
  templateUrl: './wait-list.component.html',
  styleUrls: ['./wait-list.component.css'],
})
export class WaitListComponent implements OnInit {
  readonly daycareEmail = localStorage.getItem('userEmail') || '';
  applications: DayCareApplicationDto[] = [];
  loading = false;
  errorMessage = '';

  constructor(private readonly applicationService: ApplicationService) {}

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
    this.applicationService.getMyApplications('', this.daycareEmail).subscribe({
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

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  }
}
