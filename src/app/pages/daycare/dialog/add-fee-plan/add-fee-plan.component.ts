import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { switchMap } from 'rxjs';
import { FeePlanDto } from 'src/app/models/fee-plan.model';
import { DaycareService } from 'src/app/services/daycare.service';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-add-fee-plan',
  templateUrl: './add-fee-plan.component.html',
  styleUrls: ['./add-fee-plan.component.css'],
})
export class AddFeePlanComponent {
  readonly form: FormGroup;
  saving = false;
  errorMessage = '';

  constructor(
    formBuilder: FormBuilder,
    private readonly dialogRef: MatDialogRef<AddFeePlanComponent>,
    private readonly daycareService: DaycareService,
    private readonly paymentService: PaymentService,
  ) {
    this.form = formBuilder.nonNullable.group({
      name: ['', Validators.required],
      description: [''],
      monthlyFee: [0, [Validators.required, Validators.min(0)]],
      effectiveFrom: ['', Validators.required],
      effectiveTo: [''],
      active: [true],
    });
  }

  save(): void {
    if (this.form.invalid || this.saving) {
      this.form.markAllAsTouched();
      return;
    }

    const email = localStorage.getItem('userEmail') || '';
    if (!email) {
      this.errorMessage = 'Unable to identify the signed-in daycare.';
      return;
    }

    const value = this.form.getRawValue();
    this.saving = true;
    this.errorMessage = '';

    this.daycareService
      .getMyDaycare(email)
      .pipe(
        switchMap((daycare) => {
          const daycareId = Number(daycare.id);
          if (!Number.isSafeInteger(daycareId)) {
            throw new Error('The signed-in daycare has no valid ID.');
          }

          const feePlan: FeePlanDto = {
            daycareId,
            name: value.name.trim(),
            description: value.description.trim() || undefined,
            monthlyFee: value.monthlyFee,
            effectiveFrom: value.effectiveFrom,
            effectiveTo: value.effectiveTo || null,
            active: value.active,
          };
          return this.paymentService.addFeePlan(feePlan);
        }),
      )
      .subscribe({
        next: () => this.dialogRef.close(true),
        error: () => {
          this.errorMessage = 'Unable to add the fee plan. Please try again.';
          this.saving = false;
        },
      });
  }
}
