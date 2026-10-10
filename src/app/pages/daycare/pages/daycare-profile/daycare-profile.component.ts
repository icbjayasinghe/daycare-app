import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DaycareAddress, DaycareProfile } from 'src/app/models/daycare.model';
import { DaycareService } from 'src/app/services/daycare.service';

@Component({
  selector: 'app-daycare-profile',
  templateUrl: './daycare-profile.component.html',
  styleUrls: ['./daycare-profile.component.css'],
})
export class DaycareProfileComponent implements OnInit {
  readonly profileForm: FormGroup;
  readonly email = localStorage.getItem('userEmail') || '';
  mapUrl: SafeResourceUrl | null = null;
  mapQuery = '';
  profile: DaycareProfile | null = null;
  loading = true;
  saving = false;
  isEditing = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly daycareService: DaycareService,
    private readonly sanitizer: DomSanitizer,
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      telephone: ['', Validators.required],
      owners: this.fb.array([]),
      address: this.fb.group({
        apartment: [''],
        address: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        postalCode: ['', Validators.required],
        country: ['', Validators.required],
        latitude: [null],
        longitude: [null],
      }),
    });
    this.profileForm.get('address')?.valueChanges.subscribe(() => {
      this.updateMapUrl();
    });
  }

  get owners(): FormArray {
    return this.profileForm.get('owners') as FormArray;
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.errorMessage = '';

    this.daycareService.getMyDaycare(this.email).subscribe({
      next: (profile) => {
        this.setProfile(profile);
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load daycare details. Please try again.';
        this.loading = false;
      },
    });
  }

  startEditing(): void {
    this.successMessage = '';
    this.errorMessage = '';
    this.isEditing = true;
    this.updateMapUrl();
  }

  cancelEditing(): void {
    if (this.profile) {
      this.patchForm(this.profile);
    }
    this.isEditing = false;
    this.errorMessage = '';
    this.updateMapUrl();
  }

  saveProfile(): void {
    if (this.profileForm.invalid || !this.profile) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';
    const formValue = this.profileForm.getRawValue();
    const updatedProfile: DaycareProfile = {
      ...this.profile,
      ...formValue,
      owners: formValue.owners.map(
        (owner: DaycareProfile['owners'][number]) => ({
          ...owner,
        }),
      ),
      address: formValue.address as DaycareAddress,
    };

    this.daycareService.updateMyDaycare(updatedProfile).subscribe({
      next: (savedProfile) => {
        this.setProfile(savedProfile || updatedProfile);
        this.isEditing = false;
        this.saving = false;
        this.updateMapUrl();
        this.successMessage = 'Daycare profile saved.';
      },
      error: () => {
        this.saving = false;
        this.errorMessage = 'Unable to save changes. Please try again.';
      },
    });
  }

  private setProfile(profile: DaycareProfile): void {
    this.profile = profile;
    this.patchForm(profile);
    this.updateMapUrl();
  }

  private patchForm(profile: DaycareProfile): void {
    this.profileForm.patchValue({
      name: profile.name || '',
      telephone: profile.telephone || '',
      address: {
        apartment: profile.address?.apartment || '',
        address: profile.address?.address || '',
        city: profile.address?.city || '',
        state: profile.address?.state || '',
        postalCode: profile.address?.postalCode || '',
        country: profile.address?.country || '',
        latitude: profile.address?.latitude ?? null,
        longitude: profile.address?.longitude ?? null,
      },
    });
    this.profileForm.setControl(
      'owners',
      this.fb.array(
        (profile.owners || []).map((owner) =>
          this.fb.group({
            firstName: [owner.firstName || '', Validators.required],
            lastName: [owner.lastName || '', Validators.required],
            email: [owner.email || '', [Validators.required, Validators.email]],
            phoneNumber: [owner.phoneNumber || '', Validators.required],
            userType: [owner.userType],
          }),
        ),
      ),
    );
  }

  private updateMapUrl(): void {
    const address = this.profileForm.get('address')?.value as DaycareAddress;
    const hasCoordinates =
      Number.isFinite(address?.latitude) && Number.isFinite(address?.longitude);
    const addressQuery = [
      address?.apartment,
      address?.address,
      address?.city,
      address?.state,
      address?.postalCode,
      address?.country,
    ]
      .filter((part) => typeof part === 'string' && part.trim())
      .join(', ');
    this.mapQuery =
      !this.isEditing && hasCoordinates
        ? `${address.latitude},${address.longitude}`
        : addressQuery;

    this.mapUrl = this.mapQuery
      ? this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://www.google.com/maps?q=${encodeURIComponent(this.mapQuery)}&output=embed`,
        )
      : null;
  }
}
