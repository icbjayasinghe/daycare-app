import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ParentProfileDto } from 'src/app/models/parent.model';
import { ParentService } from 'src/app/services/parent.service';

@Component({
  selector: 'app-parent-profile',
  templateUrl: './parent-profile.component.html',
  styleUrls: ['./parent-profile.component.css'],
})
export class ParentProfileComponent implements OnInit {
  readonly profileForm = this.formBuilder.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    address: this.formBuilder.nonNullable.group({
      apartment: [''],
      address: [''],
      city: [''],
      state: [''],
      postalCode: [''],
      country: [''],
    }),
  });

  readonly email = localStorage.getItem('userEmail') || '';
  profile: ParentProfileDto | null = null;
  loading = true;
  saving = false;
  isEditing = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly parentService: ParentService,
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    if (!this.email) {
      this.errorMessage = 'Unable to identify the signed-in parent.';
      this.loading = false;
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.parentService.getMyParent(this.email).subscribe({
      next: (profile) => {
        this.setProfile(profile);
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load parent details. Please try again.';
        this.loading = false;
      },
    });
  }

  startEditing(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.isEditing = true;
  }

  cancelEditing(): void {
    if (this.profile) {
      this.patchForm(this.profile);
    }
    this.isEditing = false;
    this.errorMessage = '';
  }

  saveProfile(): void {
    if (this.profileForm.invalid || !this.profile) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const formValue = this.profileForm.getRawValue();
    const updatedProfile: ParentProfileDto = {
      ...this.profile,
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      phone: formValue.phone || undefined,
      address: formValue.address,
    };

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.parentService.updateMyParent(updatedProfile).subscribe({
      next: (savedProfile) => {
        this.setProfile(savedProfile);
        this.isEditing = false;
        this.saving = false;
        this.successMessage = 'Parent profile saved.';
      },
      error: () => {
        this.saving = false;
        this.errorMessage = 'Unable to save changes. Please try again.';
      },
    });
  }

  private setProfile(profile: ParentProfileDto): void {
    this.profile = profile;
    this.patchForm(profile);
  }

  private patchForm(profile: ParentProfileDto): void {
    this.profileForm.patchValue({
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      email: profile.email || '',
      phone: profile.phone || '',
      address: {
        apartment: profile.address?.apartment || '',
        address: profile.address?.address || '',
        city: profile.address?.city || '',
        state: profile.address?.state || '',
        postalCode: profile.address?.postalCode || '',
        country: profile.address?.country || '',
      },
    });
  }
}
