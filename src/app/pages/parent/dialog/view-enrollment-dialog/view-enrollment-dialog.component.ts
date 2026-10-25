import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DayCareEnrollmentDto } from 'src/app/models/enrollment.model';

@Component({
  selector: 'app-view-enrollment-dialog',
  templateUrl: './view-enrollment-dialog.component.html',
  styleUrls: ['./view-enrollment-dialog.component.css']
})
export class ViewEnrollmentDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) readonly enrollment: DayCareEnrollmentDto,
    private readonly dialogRef: MatDialogRef<ViewEnrollmentDialogComponent>,
  ) {}

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
}
