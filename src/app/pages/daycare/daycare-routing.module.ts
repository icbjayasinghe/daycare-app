import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DaycareLayoutComponent } from './daycare-layout/daycare-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DaycareProfileComponent } from './pages/daycare-profile/daycare-profile.component';
import AuthGuard from 'src/app/guards/auth.guard';
import { WaitListComponent } from './pages/wait-list/wait-list.component';
import { CurrentStudentComponent } from './pages/current-student/current-student.component';
import { FeePlanComponent } from './pages/fee-plan/fee-plan.component';
import { FundingProgramsComponent } from './pages/funding-programs/funding-programs.component';
import { ManualInvoiceComponent } from './pages/manual-invoice/manual-invoice.component';
import { AutoInvoiceComponent } from './pages/auto-invoice/auto-invoice.component';

const routes: Routes = [
  {
    path: '',
    component: DaycareLayoutComponent,
    canActivate: [AuthGuard],
    data: { roles: ['PROVIDER'] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],
        data: { roles: ['PROVIDER'] },
      },
      {
        path: 'profile',
        component: DaycareProfileComponent,
        canActivate: [AuthGuard],
        data: { roles: ['PROVIDER'] },
      },
      {
        path: 'waiting-list',
        component: WaitListComponent,
        canActivate: [AuthGuard],
        data: { roles: ['PROVIDER'] },
      },
      {
        path: 'current-students',
        component: CurrentStudentComponent,
        canActivate: [AuthGuard],
        data: { roles: ['PROVIDER'] },
      },
      {
        path: 'fee-plan',
        component: FeePlanComponent,
        canActivate: [AuthGuard],
        data: { roles: ['PROVIDER'] },
      },
      {
        path: 'funding-programs',
        component: FundingProgramsComponent,
        canActivate: [AuthGuard],
        data: { roles: ['PROVIDER'] },
      },
      {
        path: 'manual-invoice',
        component: ManualInvoiceComponent,
        canActivate: [AuthGuard],
        data: { roles: ['PROVIDER'] },
      },
      {
        path: 'auto-invoice',
        component: AutoInvoiceComponent,
        canActivate: [AuthGuard],
        data: { roles: ['PROVIDER'] },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DaycareRoutingModule {}
