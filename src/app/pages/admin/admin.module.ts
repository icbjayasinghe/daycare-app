import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminSidebarComponent } from './components/admin-sidebar/admin-sidebar.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { DaycareRequestsComponent } from './daycare-requests/daycare-requests.component';
import { DaycareRegisteredComponent } from './daycare-registered/daycare-registered.component';

@NgModule({
  declarations: [
    AdminSidebarComponent,
    DashboardComponent,
    AdminLayoutComponent,
    AdminLoginComponent,
    DaycareRequestsComponent,
    DaycareRegisteredComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule, AdminRoutingModule],
})
export class AdminModule {}
