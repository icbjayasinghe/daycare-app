import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChildDto, ParentDto } from 'src/app/models/parent.model';
import { ParentService } from 'src/app/services/parent.service';

@Component({
  selector: 'app-child-profile',
  templateUrl: './child-profile.component.html',
  styleUrls: ['./child-profile.component.css'],
})
export class ChildProfileComponent implements OnInit {
  parent: ParentDto | null = null;
  loadingParent = false;
  parentError = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) readonly child: ChildDto,
    private readonly parentService: ParentService,
  ) {}

  ngOnInit(): void {
    if (this.child.id === undefined) {
      this.parentError = 'Parent details are unavailable for this child.';
      return;
    }

    this.loadingParent = true;
    this.parentService.getParentByChild(this.child.id).subscribe({
      next: (parent) => {
        this.parent = parent;
        this.loadingParent = false;
      },
      error: () => {
        this.parentError = 'Unable to load parent details.';
        this.loadingParent = false;
      },
    });
  }
}
