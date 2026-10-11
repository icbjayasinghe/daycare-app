import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ChildDto } from 'src/app/models/parent.model';
import { ChildService } from 'src/app/services/child.service';

@Component({
  selector: 'app-add-child-dialog',
  templateUrl: './add-child-dialog.component.html',
  styleUrls: ['./add-child-dialog.component.css'],
})
export class AddChildDialogComponent {
  readonly childForm = this.formBuilder.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    dob: ['', Validators.required],
    sex: ['', Validators.required],
  });

  readonly email = localStorage.getItem('userEmail') || '';
  saving = false;
  errorMessage = '';

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly dialogRef: MatDialogRef<AddChildDialogComponent>,
    private readonly childService: ChildService,
  ) {}

  onSubmit(): void {
    if (this.childForm.invalid) {
      this.childForm.markAllAsTouched();

      return;
    }

    const child: ChildDto = this.childForm.getRawValue();
    if (!this.email) {
      this.errorMessage = 'Unable to identify the signed-in parent.';
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    this.childService.registerChild(this.email, child).subscribe({
      next: () => this.dialogRef.close(child),
      error: () => {
        this.saving = false;
        this.errorMessage = 'Unable to add child. Please try again.';
      },
    });
  }
}
