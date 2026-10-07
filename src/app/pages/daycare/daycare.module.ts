import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DaycareRoutingModule } from './daycare-routing.module';
import { DaycareSidebarComponent } from './components/daycare-sidebar/daycare-sidebar.component';
import { DaycareLayoutComponent } from './daycare-layout/daycare-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';


@NgModule({
  declarations: [
    DaycareSidebarComponent,
    DaycareLayoutComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    DaycareRoutingModule
  ]
})
export class DaycareModule { }
