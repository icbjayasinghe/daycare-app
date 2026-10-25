import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {
  DayCareEnrollmentDto,
  EnrollmentStatus,
} from 'src/app/models/enrollment.model';
import { EnrollmentService } from 'src/app/services/enrollment.service';

@Component({
  selector: 'app-view-enrollment-dialog',
  templateUrl: './view-enrollment-dialog.component.html',
  styleUrls: ['./view-enrollment-dialog.component.css']
})
export class ViewEnrollmentDialogComponent {
  readonly EnrollmentStatus = EnrollmentStatus;
  readonly mapQuery: string;
  readonly mapUrl: SafeResourceUrl | null;
  saving = false;
  errorMessage = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) readonly enrollment: DayCareEnrollmentDto,
    private readonly dialogRef: MatDialogRef<ViewEnrollmentDialogComponent>,
    private readonly sanitizer: DomSanitizer,
    private readonly enrollmentService: EnrollmentService,
  ) {
    const address = enrollment.daycare?.address;
    const latitude = address?.latitude;
    const longitude = address?.longitude;
    const hasCoordinates =
      typeof latitude === 'number' &&
      Number.isFinite(latitude) &&
      typeof longitude === 'number' &&
      Number.isFinite(longitude);

    this.mapQuery = hasCoordinates
      ? `${latitude},${longitude}`
      : this.daycareAddress;
    this.mapUrl = this.mapQuery
      ? this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://www.google.com/maps?q=${encodeURIComponent(this.mapQuery)}&output=embed`,
        )
      : null;
  }

  get daycareAddress(): string {
    const address = this.enrollment.daycare?.address;
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

  close(): void {
    this.dialogRef.close();
  }

  updateStatus(status: EnrollmentStatus.COMPLETED | EnrollmentStatus.WITHDRAWN): void {
    if (this.saving) {
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    this.enrollmentService
      .updateEnrollment({ ...this.enrollment, status })
      .subscribe({
        next: (updatedEnrollment) => {
          this.saving = false;
          this.dialogRef.close(updatedEnrollment);
        },
        error: () => {
          this.saving = false;
          this.errorMessage =
            'Unable to update the enrollment status. Please try again.';
        },
      });
  }
}
