import { Component, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-daycare-signup-dialog',
  templateUrl: './daycare-signup-dialog.component.html',
  styleUrls: ['./daycare-signup-dialog.component.css'],
})
export class DaycareSignupDialogComponent {
  readonly loginForm: FormGroup;
  readonly registerForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    @Optional()
    private readonly dialogRef?: MatDialogRef<DaycareSignupDialogComponent>,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      telephone: ['', Validators.required],
      owners: this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        phoneNumber: ['', Validators.required],
      }),
      address: this.fb.group({
        apartment: [''],
        address: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        postalCode: ['', Validators.required],
        country: ['', Validators.required],
      }),
    });
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.dialogRef?.close(this.loginForm.getRawValue());
  }

  onRegister(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const formValue = this.registerForm.getRawValue();
    this.dialogRef?.close({
      name: formValue.name,
      telephone: formValue.telephone,
      owners: [{ ...formValue.owners, userType: 0 }],
      address: formValue.address,
    });
  }
}
