import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DaycareConfigDto } from 'src/app/models/daycare-config.model';
import { DaycareProfile } from 'src/app/models/daycare.model';
import { DaycareConfigService } from 'src/app/services/daycare-config.service';

@Component({
  selector: 'app-daycare-config',
  templateUrl: './daycare-config.component.html',
  styleUrls: ['./daycare-config.component.css'],
})
export class DaycareConfigComponent implements OnInit {
  readonly form: FormGroup;
  configuration: DaycareConfigDto | null = null;
  loading = true;
  saving = false;
  isEditing = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private readonly dialogRef: MatDialogRef<DaycareConfigComponent>,
    private readonly formBuilder: FormBuilder,
    private readonly configService: DaycareConfigService,
    @Inject(MAT_DIALOG_DATA) private readonly daycare: DaycareProfile,
  ) {
    this.form = this.formBuilder.nonNullable.group({
      totalCapacity: [0, [Validators.required, Validators.min(1)]],
      hourlyCharge: [0, [Validators.required, Validators.min(0)]],
      paymentsEnabled: [{ value: false, disabled: true }],
    });
  }

  ngOnInit(): void {
    this.loadConfiguration();
  }

  loadConfiguration(): void {
    const daycareId = this.getDaycareId();
    this.loading = true;
    this.errorMessage = '';
    if (daycareId === undefined) {
      this.loading = false;
      this.errorMessage = 'Unable to identify the signed-in daycare.';
      return;
    }

    this.configService.getDaycareConfig(daycareId).subscribe({
      next: (configuration) => {
        this.configuration = configuration;
        this.patchForm(configuration);
        this.isEditing = false;
        this.loading = false;
      },
      error: () => {
        this.configuration = null;
        this.isEditing = true;
        this.loading = false;
        this.errorMessage =
          'No existing daycare configuration was found. Add one below.';
      },
    });
  }

  startEditing(): void {
    if (this.configuration) {
      this.patchForm(this.configuration);
      this.isEditing = true;
      this.errorMessage = '';
      this.successMessage = '';
    }
  }

  cancelEditing(): void {
    if (this.configuration) {
      this.patchForm(this.configuration);
      this.isEditing = false;
      this.errorMessage = '';
      this.successMessage = '';
    }
  }

  save(): void {
    if (this.form.invalid || this.saving) {
      this.form.markAllAsTouched();
      return;
    }
    const daycareId = this.getDaycareId();
    if (daycareId === undefined) {
      this.errorMessage = 'Unable to identify the signed-in daycare.';
      return;
    }

    const value = this.form.getRawValue();
    const configuration: DaycareConfigDto = {
      ...this.configuration,
      configId: this.configuration?.configId,
      daycareId,
      totalCapacity: value.totalCapacity,
      hourlyCharge: value.hourlyCharge,
      paymentsEnabled: false,
    };
    const isUpdate = !!this.configuration;
    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const request = isUpdate
      ? this.configService.updateDaycareConfig(configuration)
      : this.configService.registerDaycareConfig(configuration);
    request.subscribe({
      next: (saved) => {
        const savedConfiguration = saved || configuration;
        this.configuration = savedConfiguration;
        this.patchForm(savedConfiguration);
        this.isEditing = false;
        this.saving = false;
        this.successMessage = isUpdate
          ? 'Daycare configuration saved.'
          : 'Daycare configuration added.';
      },
      error: () => {
        this.saving = false;
        this.errorMessage =
          'Unable to save daycare configuration. Please try again.';
      },
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  private getDaycareId(): number | undefined {
    const daycareId = Number(this.daycare?.id);
    return Number.isSafeInteger(daycareId) && daycareId > 0
      ? daycareId
      : undefined;
  }

  private patchForm(configuration: DaycareConfigDto): void {
    this.form.reset({
      totalCapacity: configuration.totalCapacity ?? 0,
      hourlyCharge: configuration.hourlyCharge ?? 0,
      paymentsEnabled: configuration.paymentsEnabled ?? false,
    });
  }
}
