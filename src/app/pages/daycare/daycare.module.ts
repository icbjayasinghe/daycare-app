import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { DaycareRoutingModule } from './daycare-routing.module';
import { DaycareSidebarComponent } from './components/daycare-sidebar/daycare-sidebar.component';
import { DaycareLayoutComponent } from './daycare-layout/daycare-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DaycareProfileComponent } from './pages/daycare-profile/daycare-profile.component';

@NgModule({
  declarations: [
    DaycareSidebarComponent,
    DaycareLayoutComponent,
    DashboardComponent,
    DaycareProfileComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule, DaycareRoutingModule],
})
export class DaycareModule {}
