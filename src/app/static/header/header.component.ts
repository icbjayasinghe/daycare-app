import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DaycareSignupDialogComponent } from 'src/app/pages/dialog/daycare-signup-dialog/daycare-signup-dialog.component';
import { ParentSignupDialogComponent } from 'src/app/pages/dialog/parent-signup-dialog/parent-signup-dialog.component';
import { AuthServiceService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  readonly dialog = inject(MatDialog);

  constructor(
    public authService: AuthServiceService,
    private router: Router,
  ) {}

  openParentDialog() {
    this.dialog.open(ParentSignupDialogComponent);
  }

  openDaycareDialog() {
    this.dialog.open(DaycareSignupDialogComponent);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/pages/home']);
  }
}
