import { Component, OnInit } from '@angular/core';
import { DaycareProfile, DaycareStatus } from 'src/app/models/daycare.model';
import { DaycareService } from 'src/app/services/daycare.service';

@Component({
  selector: 'app-daycare-registered',
  templateUrl: './daycare-registered.component.html',
  styleUrls: ['./daycare-registered.component.css'],
})
export class DaycareRegisteredComponent implements OnInit {
  readonly DaycareStatus = DaycareStatus;
  readonly approvedStatus = DaycareStatus.APPROVED;
  readonly deactivatedStatus = DaycareStatus.DEACTIVATED;
  readonly allStatuses = 'ALL' as const;
  selectedStatus: DaycareStatus.APPROVED | 'ALL' = DaycareStatus.APPROVED;
  daycares: DaycareProfile[] = [];
  loading = false;
  errorMessage = '';
  statusUpdateError = '';
  readonly updatingDaycareIds = new Set<number | string>();

  get filteredDaycares(): DaycareProfile[] {
    return this.selectedStatus === this.allStatuses
      ? this.daycares
      : this.daycares.filter(
          (daycare) =>
            (daycare.status ?? DaycareStatus.APPROVED) === this.selectedStatus,
        );
  }

  constructor(private readonly daycareService: DaycareService) {}

  ngOnInit(): void {
    this.loadDaycares();
  }

  loadDaycares(): void {
    this.loading = true;
    this.errorMessage = '';
    this.daycareService.getDaycares().subscribe({
      next: (daycares) => {
        this.daycares = daycares;
        this.loading = false;
      },
      error: () => {
        this.errorMessage =
          'Unable to load daycares. Please try again.';
        this.loading = false;
      },
    });
  }

  onFilterChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedStatus =
      value === this.allStatuses ? this.allStatuses : DaycareStatus.APPROVED;
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

  updateDaycareStatus(daycare: DaycareProfile, status: DaycareStatus): void {
    const daycareId = daycare.id;
    if (
      daycareId === undefined ||
      this.updatingDaycareIds.has(daycareId) ||
      daycare.status === status
    ) {
      return;
    }

    const previousStatus = daycare.status;
    this.statusUpdateError = '';
    this.updatingDaycareIds.add(daycareId);
    this.daycareService
      .updateMyDaycare({ ...daycare, status })
      .subscribe({
        next: (updatedDaycare) => {
          daycare.status = updatedDaycare.status ?? status;
          this.updatingDaycareIds.delete(daycareId);
        },
        error: () => {
          daycare.status = previousStatus;
          this.updatingDaycareIds.delete(daycareId);
          this.statusUpdateError =
            'Unable to update the daycare status. Please try again.';
        },
      });
  }

  deactivateDaycare(daycare: DaycareProfile): void {
    if ((daycare.status ?? DaycareStatus.APPROVED) !== DaycareStatus.APPROVED) {
      return;
    }
    this.updateDaycareStatus(daycare, DaycareStatus.DEACTIVATED);
  }

  activateDaycare(daycare: DaycareProfile): void {
    if (daycare.status !== DaycareStatus.DEACTIVATED) {
      return;
    }
    this.updateDaycareStatus(daycare, DaycareStatus.APPROVED);
  }
}
