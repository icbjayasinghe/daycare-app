import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddChildDialogComponent } from '../../dialog/add-child-dialog/add-child-dialog.component';

@Component({
  selector: 'app-parent-children',
  templateUrl: './parent-children.component.html',
  styleUrls: ['./parent-children.component.css']
})
export class ParentChildrenComponent {
  private readonly dialog = inject(MatDialog);

  openAddChildDialog(): void {
    this.dialog.open(AddChildDialogComponent);
  }
}
