import { Component, OnInit } from '@angular/core';
import { DaycareDashboardDto } from 'src/app/models/daycare-dashboard.model';
import { ApplicationStatus } from 'src/app/models/daycare-application.model';
import { DashboardService } from 'src/app/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  readonly daycareEmail = localStorage.getItem('userEmail') || '';
  dashboardData: DaycareDashboardDto | null = null;
  loading = false;
  errorMessage = '';

  constructor(private readonly dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    if (!this.daycareEmail) {
      this.errorMessage = 'Unable to identify the signed-in daycare.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.dashboardService.getMyDaycareDashboardData(this.daycareEmail).subscribe({
      next: (dashboardData) => {
        this.dashboardData = dashboardData;
        this.loading = false;
      },
      error: () => {
        this.errorMessage =
          'Unable to load your daycare dashboard. Please try again.';
        this.loading = false;
      },
    });
  }

  getStatusClass(status: ApplicationStatus): string {
    return `status-${status.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  }

  objectEntries(summary: Record<string, number>): [string, number][] {
    return Object.entries(summary);
  }
}
