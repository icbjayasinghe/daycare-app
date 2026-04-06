import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-parent-signup-dialog',
  templateUrl: './parent-signup-dialog.component.html',
  styleUrls: ['./parent-signup-dialog.component.css'],
  
})
export class ParentSignupDialogComponent {
  signupForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.signupForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required]],
      address2: [''],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      postalCode: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]]

      // phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      // password: ['', [Validators.required, Validators.minLength(8)]],
      // confirmPassword: ['', [Validators.required]]
    }, 
    // { validators: this.passwordMatchValidator }
  );
  }

  // passwordMatchValidator(form: FormGroup) {
  //   const password = form.get('password');
  //   const confirmPassword = form.get('confirmPassword');
  //   return password && confirmPassword && password.value === confirmPassword.value
  //     ? null : { mismatch: true };
  // }

  onSubmit() {
    
    if (this.signupForm.valid) {
      console.log('Form Data:', this.signupForm.value);
      // Handle form submission (e.g., API call)
    }
  }

  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  passwordFormControl = new FormControl('', [Validators.required, Validators.minLength(6)]);

}
