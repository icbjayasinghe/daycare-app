import { Component, OnInit } from '@angular/core';
import { DaycareProfile, DaycareStatus } from 'src/app/models/daycare.model';
import { DaycareService } from 'src/app/services/daycare.service';

@Component({
  selector: 'app-daycare-registered',
  templateUrl: './daycare-registered.component.html',
  styleUrls: ['./daycare-registered.component.css'],
})
export class DaycareRegisteredComponent implements OnInit {
  readonly approvedStatus = DaycareStatus.APPROVED;
  daycares: DaycareProfile[] = [];
  loading = false;
  errorMessage = '';

  constructor(private readonly daycareService: DaycareService) {}

  ngOnInit(): void {
    this.loadApprovedDaycares();
  }

  loadApprovedDaycares(): void {
    this.loading = true;
    this.errorMessage = '';
    this.daycareService.getDaycares(DaycareStatus.APPROVED).subscribe({
      next: (daycares) => {
        this.daycares = daycares;
        this.loading = false;
      },
      error: () => {
        this.errorMessage =
          'Unable to load registered daycares. Please try again.';
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
}
