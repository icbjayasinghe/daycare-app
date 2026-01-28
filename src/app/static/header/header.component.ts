import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ParentSignupDialogComponent } from 'src/app/pages/dialog/parent-signup-dialog/parent-signup-dialog.component';
import {
  MAT_DIALOG_DATA,
  // MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  readonly dialog = inject(MatDialog);
  openParentDialog() {
    const dialogRef = this.dialog.open(ParentSignupDialogComponent);
    // Logic to open the parent signup dialog
  }

}
