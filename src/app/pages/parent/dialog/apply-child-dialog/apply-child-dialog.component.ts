import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DaycareProfile } from 'src/app/models/daycare.model';
import {
  ApplicationStatus,
  DayCareApplicationDto,
} from 'src/app/models/daycare-application.model';
import { ChildDto } from 'src/app/models/parent.model';
import { ChildService } from 'src/app/services/child.service';

@Component({
  selector: 'app-apply-child-dialog',
  templateUrl: './apply-child-dialog.component.html',
  styleUrls: ['./apply-child-dialog.component.css'],
})
export class ApplyChildDialogComponent implements OnInit {
  readonly parentEmail = localStorage.getItem('userEmail') || '';
  children: ChildDto[] = [];
  selectedChild: ChildDto | null = null;
  currentStep = 1;
  applicationMethod: 'portal' | 'website' = 'portal';
  loadingChildren = false;
  saving = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) readonly daycare: DaycareProfile,
    private readonly childService: ChildService,
    private readonly dialogRef: MatDialogRef<ApplyChildDialogComponent>,
  ) {}

  ngOnInit(): void {
    if (!this.parentEmail) {
      this.errorMessage = 'Unable to identify the signed-in parent.';
      return;
    }

    this.loadingChildren = true;
    this.childService.getMyChildren(this.parentEmail).subscribe({
      next: (children) => {
        this.children = children;
        this.loadingChildren = false;
      },
      error: () => {
        this.loadingChildren = false;
        this.errorMessage = 'Unable to load your children. Please try again.';
      },
    });
  }

  get websiteUrl(): string {
    const website = this.daycare.website?.trim();
    if (!website) {
      return '';
    }

    try {
      const url = new URL(
        /^[a-z][a-z\d+.-]*:\/\//i.test(website)
          ? website
          : `https://${website}`,
      );
      return url.protocol === 'http:' || url.protocol === 'https:'
        ? url.toString()
        : '';
    } catch {
      return '';
    }
  }

  get daycareAddress(): string {
    const address = this.daycare.address;
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

  selectChild(child: ChildDto): void {
    this.selectedChild = child;
    this.errorMessage = '';
  }

  goToStep(step: number): void {
    if (step < 1 || step > 3 || this.saving) {
      return;
    }
    if (step > 1 && this.applicationMethod === 'website' && !this.websiteUrl) {
      this.errorMessage = 'This daycare has not provided a valid website.';
      return;
    }
    if (step > 2 && !this.selectedChild) {
      this.errorMessage = 'Select a child before continuing.';
      return;
    }

    this.errorMessage = '';
    this.currentStep = step;
  }

  apply(): void {
    if (!this.selectedChild) {
      this.errorMessage = 'Select a child before applying.';
      this.currentStep = 2;
      return;
    }

    if (this.applicationMethod === 'website') {
      if (!this.websiteUrl) {
        this.errorMessage = 'This daycare has not provided a valid website.';
        return;
      }
      window.open(this.websiteUrl, '_blank', 'noopener,noreferrer');
      this.successMessage = 'The daycare website has been opened in a new tab.';
      return;
    }

    if (!this.parentEmail) {
      this.errorMessage = 'Unable to identify the signed-in parent.';
      return;
    }
    if (this.daycare.id === undefined || this.daycare.id === null) {
      this.errorMessage = 'This daycare is missing its identifier.';
      return;
    }

    const application: DayCareApplicationDto = {
      child: this.selectedChild,
      dayCare: this.daycare,
      status: ApplicationStatus.PENDING,
    };

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.childService
      .applyDaycare(this.parentEmail, this.daycare.id, application)
      .subscribe({
        next: () => {
          this.saving = false;
          this.successMessage = 'Your application has been submitted.';
          this.dialogRef.close(application);
        },
        error: () => {
          this.saving = false;
          this.errorMessage =
            'Unable to submit your application. Please try again.';
        },
      });
  }
}
