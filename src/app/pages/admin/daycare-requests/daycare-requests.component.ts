import { Component, OnInit } from '@angular/core';
import { DaycareProfile, DaycareStatus } from 'src/app/models/daycare.model';
import { DaycareService } from 'src/app/services/daycare.service';

@Component({
  selector: 'app-daycare-requests',
  templateUrl: './daycare-requests.component.html',
  styleUrls: ['./daycare-requests.component.css'],
})
export class DaycareRequestsComponent implements OnInit {
  readonly DaycareStatus = DaycareStatus;
  readonly pendingStatus = DaycareStatus.PENDING;
  daycares: DaycareProfile[] = [];
  loading = false;
  errorMessage = '';
  statusUpdateError = '';
  readonly updatingDaycareIds = new Set<number | string>();

  constructor(private readonly daycareService: DaycareService) {}

  ngOnInit(): void {
    this.loadPendingDaycares();
  }

  loadPendingDaycares(): void {
    this.loading = true;
    this.errorMessage = '';
    this.daycareService.getDaycares(DaycareStatus.PENDING).subscribe({
      next: (daycares) => {
        this.daycares = daycares;
        this.loading = false;
      },
      error: () => {
        this.errorMessage =
          'Unable to load pending daycare requests. Please try again.';
        this.loading = false;
      },
    });
  }

  getOwnerName(daycare: DaycareProfile): string {
    const owner = daycare.owners[0];
    return owner ? `${owner.firstName} ${owner.lastName}`.trim() : '—';
  }

  getOwnerEmail(daycare: DaycareProfile): string {
    return daycare.owners[0]?.email || '—';
  }

  getLocation(daycare: DaycareProfile): string {
    const { city, state, country } = daycare.address;
    return [city, state, country].filter(Boolean).join(', ') || '—';
  }

  updateStatus(daycare: DaycareProfile, status: DaycareStatus): void {
    const daycareId = daycare.id;
    if (
      daycareId === undefined ||
      this.updatingDaycareIds.has(daycareId) ||
      (daycare.status && daycare.status !== DaycareStatus.PENDING)
    ) {
      return;
    }

    const previousStatus = daycare.status;
    const updatedDaycare = { ...daycare, status };
    this.statusUpdateError = '';
    this.updatingDaycareIds.add(daycareId);

    this.daycareService.updateMyDaycare(updatedDaycare).subscribe({
      next: (savedDaycare) => {
        daycare.status = savedDaycare.status ?? status;
        this.updatingDaycareIds.delete(daycareId);
        this.daycares = this.daycares.filter((item) => item !== daycare);
      },
      error: () => {
        daycare.status = previousStatus;
        this.updatingDaycareIds.delete(daycareId);
        this.statusUpdateError =
          'Unable to update the daycare status. Please try again.';
      },
    });
  }
}
