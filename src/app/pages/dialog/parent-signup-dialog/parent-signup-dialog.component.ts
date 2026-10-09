import { Component, Optional } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ParentService } from 'src/app/services/parent.service';
import { ParentDto } from 'src/app/models/parent.model';
import { AuthServiceService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-parent-signup-dialog',
  templateUrl: './parent-signup-dialog.component.html',
  styleUrls: ['./parent-signup-dialog.component.css'],
})
export class ParentSignupDialogComponent {
  signupForm: FormGroup;
  loginForm: FormGroup;

  loading = false;
  loginError = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthServiceService,
    private parentService: ParentService,
    private router: Router,
    @Optional() private dialogRef?: MatDialogRef<ParentSignupDialogComponent>,
  ) {
    this.signupForm = this.fb.group(
      {
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        address: ['', [Validators.required]],
        apartment: [''],
        city: ['', [Validators.required]],
        state: ['', [Validators.required]],
        postalCode: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(6),
          ],
        ],
      },
      // { validators: this.passwordMatchValidator }
    );

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
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
        if (!this.authService.establishParentSession(response, email!)) {
          this.loading = false;
          this.loginError = 'This account does not have parent access.';
          return;
        }

        this.loading = false;
        this.dialogRef?.close();
        this.router.navigate(['/pages/parent/dashboard']);
      },
      error: (error) => {
        this.loading = false;
        this.loginError = 'Invalid email or password.';
      },
    });
  }

  // passwordMatchValidator(form: FormGroup) {
  //   const password = form.get('password');
  //   const confirmPassword = form.get('confirmPassword');
  //   return password && confirmPassword && password.value === confirmPassword.value
  //     ? null : { mismatch: true };
  // }

  onSubmit() {
    if (this.signupForm.valid) {
      this.registerParent();
      // Handle form submission (e.g., API call)
    }
  }
  registerParent() {
    const formValue = this.signupForm.value;

    // Map form values to ParentDto model
    const parentData: ParentDto = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      password: formValue.password,
      phone: formValue.phone,
      parentStatus: 1,
      address: {
        address: formValue.address,
        apartment: formValue.apartment,
        city: formValue.city,
        state: formValue.state,
        postalCode: formValue.postalCode,
        country: 'CAN',
      },
      children: [],
    };

    this.parentService.registerParent(parentData).subscribe(
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

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  passwordFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
  ]);
}
