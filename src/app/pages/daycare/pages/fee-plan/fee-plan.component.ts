import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddFeePlanComponent } from '../../dialog/add-fee-plan/add-fee-plan.component';

@Component({
  selector: 'app-fee-plan',
  templateUrl: './fee-plan.component.html',
  styleUrls: ['./fee-plan.component.css'],
})
export class FeePlanComponent {
  constructor(private readonly dialog: MatDialog) {}

  openAddFeePlanDialog(): void {
    this.dialog.open(AddFeePlanComponent, {
      width: 'min(560px, 94vw)',
      maxHeight: '90vh',
    });
  }
}
