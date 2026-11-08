import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { switchMap } from 'rxjs';
import { FeePlanDto } from 'src/app/models/fee-plan.model';
import { DaycareService } from 'src/app/services/daycare.service';
import { PaymentService } from 'src/app/services/payment.service';
import { AddFeePlanComponent } from '../../dialog/add-fee-plan/add-fee-plan.component';

@Component({
  selector: 'app-fee-plan',
  templateUrl: './fee-plan.component.html',
  styleUrls: ['./fee-plan.component.css'],
})
export class FeePlanComponent implements OnInit {
  readonly daycareEmail = localStorage.getItem('userEmail') || '';
  feePlans: FeePlanDto[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private readonly dialog: MatDialog,
    private readonly daycareService: DaycareService,
    private readonly paymentService: PaymentService,
  ) {}

  ngOnInit(): void {
    this.loadFeePlans();
  }

  loadFeePlans(): void {
    if (!this.daycareEmail) {
      this.errorMessage = 'Unable to identify the signed-in daycare.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.daycareService
      .getMyDaycare(this.daycareEmail)
      .pipe(
        switchMap((daycare) => {
          const daycareId = Number(daycare.id);
          if (!Number.isSafeInteger(daycareId) || daycareId <= 0) {
            throw new Error('The signed-in daycare has no valid ID.');
          }
          return this.paymentService.getMyFeePlans(daycareId, true);
        }),
      )
      .subscribe({
        next: (feePlans) => {
          this.feePlans = feePlans;
          this.loading = false;
        },
        error: () => {
          this.errorMessage = 'Unable to load fee plans. Please try again.';
          this.loading = false;
        },
      });
  }

  openAddFeePlanDialog(): void {
    this.dialog
      .open(AddFeePlanComponent, {
      width: 'min(560px, 94vw)',
      maxHeight: '90vh',
      })
      .afterClosed()
      .subscribe((created: boolean | undefined) => {
        if (created) {
          this.loadFeePlans();
        }
      });
  }
}
