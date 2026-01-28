import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-parent-signup-dialog',
  templateUrl: './parent-signup-dialog.component.html',
  styleUrls: ['./parent-signup-dialog.component.css'],
  
})
export class ParentSignupDialogComponent {

  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  passwordFormControl = new FormControl('', [Validators.required, Validators.minLength(6)]);

}
