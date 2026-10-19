import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DaycareProfile, DaycareStatus } from 'src/app/models/daycare.model';
import { DaycareService } from 'src/app/services/daycare.service';
import { ApplyChildDialogComponent } from '../../dialog/apply-child-dialog/apply-child-dialog.component';

@Component({
  selector: 'app-parent-daycares',
  templateUrl: './parent-daycares.component.html',
  styleUrls: ['./parent-daycares.component.css'],
})
export class ParentDaycaresComponent implements OnInit {
  daycares: DaycareProfile[] = [];
  selectedDaycare: DaycareProfile | null = null;
  mapUrl: SafeResourceUrl | null = null;
  loading = true;
  errorMessage = '';
  readonly visibleTelephoneNumbers = new Set<DaycareProfile>();
  readonly visibleEmails = new Set<DaycareProfile>();

  constructor(
    private readonly daycareService: DaycareService,
    private readonly sanitizer: DomSanitizer,
    private readonly dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.daycareService.getDaycares(DaycareStatus.APPROVED).subscribe({
      next: (daycares) => {
        this.daycares = daycares;
        this.loading = false;
        if (daycares.length > 0) {
          this.selectDaycare(daycares[0]);
        }
      },
      error: () => {
        this.errorMessage = 'Unable to load daycares. Please try again later.';
        this.loading = false;
      },
    });
  }

  selectDaycare(daycare: DaycareProfile): void {
    this.selectedDaycare = daycare;
    const address = daycare.address;
    const latitude = address?.latitude;
    const longitude = address?.longitude;
    const hasCoordinates =
      typeof latitude === 'number' &&
      Number.isFinite(latitude) &&
      typeof longitude === 'number' &&
      Number.isFinite(longitude);
    const location = hasCoordinates
      ? `${latitude},${longitude}`
      : [
          address?.apartment,
          address?.address,
          address?.city,
          address?.state,
          address?.postalCode,
          address?.country,
        ]
          .filter((part) => typeof part === 'string' && part.trim())
          .join(', ');

    this.mapUrl = location
      ? this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://www.google.com/maps?q=${encodeURIComponent(location)}&output=embed`,
        )
      : null;
  }

  getAddressLabel(daycare: DaycareProfile): string {
    const address = daycare.address;
    return (
      [
        address?.apartment,
        address?.address,
        address?.city,
        address?.state,
        address?.postalCode,
        address?.country,
      ]
        .filter((part) => typeof part === 'string' && part.trim())
        .join(', ') || 'Address not provided'
    );
  }

  getDaycareEmail(daycare: DaycareProfile): string {
    return daycare.owners[0]?.email || '';
  }

  toggleTelephone(daycare: DaycareProfile): void {
    this.toggleContactVisibility(this.visibleTelephoneNumbers, daycare);
  }

  toggleEmail(daycare: DaycareProfile): void {
    this.toggleContactVisibility(this.visibleEmails, daycare);
  }

  openApplyDialog(daycare: DaycareProfile): void {
    this.dialog.open(ApplyChildDialogComponent, { data: daycare });
  }

  onRowKeydown(event: KeyboardEvent, daycare: DaycareProfile): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.selectDaycare(daycare);
    }
  }

  private toggleContactVisibility(
    visibleContacts: Set<DaycareProfile>,
    daycare: DaycareProfile,
  ): void {
    if (visibleContacts.has(daycare)) {
      visibleContacts.delete(daycare);
    } else {
      visibleContacts.add(daycare);
    }
  }
}
