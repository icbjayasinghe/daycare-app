import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DaycareRoutingModule } from './daycare-routing.module';
import { DaycareSidebarComponent } from './components/daycare-sidebar/daycare-sidebar.component';
import { DaycareLayoutComponent } from './daycare-layout/daycare-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DaycareProfileComponent } from './pages/daycare-profile/daycare-profile.component';
import { WaitListComponent } from './pages/wait-list/wait-list.component';
import { ChildProfileComponent } from './dialog/child-profile/child-profile.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { CurrentStudentComponent } from './pages/current-student/current-student.component';
import { FeePlanComponent } from './pages/fee-plan/fee-plan.component';
import { AddFeePlanComponent } from './dialog/add-fee-plan/add-fee-plan.component';
import { DaycareConfigComponent } from './dialog/daycare-config/daycare-config.component';
import { FundingProgramsComponent } from './pages/funding-programs/funding-programs.component';
import { ManualInvoiceComponent } from './pages/manual-invoice/manual-invoice.component';
import { AutoInvoiceComponent } from './pages/auto-invoice/auto-invoice.component';

@NgModule({
  declarations: [
    DaycareSidebarComponent,
    DaycareLayoutComponent,
    DashboardComponent,
    DaycareProfileComponent,
    WaitListComponent,
    ChildProfileComponent,
    CurrentStudentComponent,
    FeePlanComponent,
    AddFeePlanComponent,
    DaycareConfigComponent,
    FundingProgramsComponent,
    ManualInvoiceComponent,
    AutoInvoiceComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DaycareRoutingModule,
    MaterialModule,
  ],
})
export class DaycareModule {}
