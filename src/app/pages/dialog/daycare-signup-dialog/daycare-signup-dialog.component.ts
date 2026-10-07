import { Component, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DaycareDto } from 'src/app/models/daycare.model';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { DaycareService } from 'src/app/services/daycare.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-daycare-signup-dialog',
  templateUrl: './daycare-signup-dialog.component.html',
  styleUrls: ['./daycare-signup-dialog.component.css'],
})
export class DaycareSignupDialogComponent {
  readonly loginForm: FormGroup;
  readonly registerForm: FormGroup;
  loading = false;
  loginError = '';

  constructor(
    private readonly fb: FormBuilder,
    private daycareService: DaycareService,
    private authService: AuthServiceService,
    private router: Router,
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
    this.loading = true;
    this.loginError = '';

    const { email, password } = this.loginForm.getRawValue();

    this.authService.login(email!, password!).subscribe({
      next: (response) => {
        if (!this.authService.establishDaycareSession(response)) {
          this.loading = false;
          this.loginError = 'This account does not have daycare access.';
          return;
        }

        this.loading = false;
        this.dialogRef?.close();
        this.router.navigate(['/pages/admin/dashboard']);
      },
      error: (error) => {
        this.loading = false;
        this.loginError = 'Invalid email or password.';
      },
    });
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

    const daycareData: DaycareDto = {
      name: formValue.name,
      telephone: formValue.telephone,
      owners: [{ ...formValue.owners, userType: 0 }],
      address: formValue.address,
    };

    console.log('Registering daycare:', daycareData);

    this.daycareService.registerDaycare(daycareData).subscribe(
      (response: any) => {
        console.log('Parent registered successfully:', response);
        // Handle successful registration (e.g., show a success message, close dialog)
      },

      // error => {
      //   console.error('Error registering parent:', error);
      //   // Handle registration error (e.g., show an error message)
      // }
    );
  }
}
