import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChildDto } from 'src/app/models/parent.model';
import { ChildService } from 'src/app/services/child.service';
import { AddChildDialogComponent } from '../../dialog/add-child-dialog/add-child-dialog.component';

@Component({
  selector: 'app-parent-children',
  templateUrl: './parent-children.component.html',
  styleUrls: ['./parent-children.component.css'],
})
export class ParentChildrenComponent implements OnInit {
  private readonly dialog = inject(MatDialog);
  private readonly childService = inject(ChildService);
  readonly email = localStorage.getItem('userEmail') || '';

  children: ChildDto[] = [];
  selectedChild: ChildDto | null = null;
  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadChildren();
  }

  loadChildren(): void {
    if (!this.email) {
      this.errorMessage = 'Unable to identify the signed-in parent.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.childService.getMyChildren(this.email).subscribe({
      next: (children) => {
        this.children = children;
        this.selectedChild = null;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load children. Please try again.';
        this.loading = false;
      },
    });
  }

  selectChild(child: ChildDto): void {
    this.selectedChild = this.selectedChild === child ? null : child;
  }

  openAddChildDialog(): void {
    this.dialog
      .open(AddChildDialogComponent)
      .afterClosed()
      .subscribe((child: ChildDto | undefined) => {
        if (child) {
          this.loadChildren();
        }
      });
  }
}
