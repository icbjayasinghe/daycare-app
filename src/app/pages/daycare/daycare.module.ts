import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { DaycareRoutingModule } from './daycare-routing.module';
import { DaycareSidebarComponent } from './components/daycare-sidebar/daycare-sidebar.component';
import { DaycareLayoutComponent } from './daycare-layout/daycare-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DaycareProfileComponent } from './pages/daycare-profile/daycare-profile.component';
import { WaitListComponent } from './pages/wait-list/wait-list.component';
import { ChildProfileComponent } from './dialog/child-profile/child-profile.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { CurrentStudentComponent } from './pages/current-student/current-student.component';

@NgModule({
  declarations: [
    DaycareSidebarComponent,
    DaycareLayoutComponent,
    DashboardComponent,
    DaycareProfileComponent,
    WaitListComponent,
    ChildProfileComponent,
    CurrentStudentComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DaycareRoutingModule,
    MaterialModule,
  ],
})
export class DaycareModule {}
