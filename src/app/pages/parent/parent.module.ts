import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ParentRoutingModule } from './parent-routing.module';
import { ParentLayoutComponent } from './parent-layout/parent-layout.component';
import { ParentSidebarComponent } from './components/parent-sidebar/parent-sidebar.component';
import { ParentDashboardComponent } from './pages/parent-dashboard/parent-dashboard.component';
import { RouterModule } from '@angular/router';
import { ParentDaycaresComponent } from './pages/parent-daycares/parent-daycares.component';
import { ParentChildrenComponent } from './pages/parent-children/parent-children.component';
import { AddChildDialogComponent } from './dialog/add-child-dialog/add-child-dialog.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ParentProfileComponent } from './pages/parent-profile/parent-profile.component';

@NgModule({
  declarations: [
    ParentLayoutComponent,
    ParentSidebarComponent,
    ParentDashboardComponent,
    ParentDaycaresComponent,
    ParentChildrenComponent,
    AddChildDialogComponent,
    ParentProfileComponent,
  ],
  imports: [
    CommonModule,
    ParentRoutingModule,
    RouterModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
})
export class ParentModule {}
