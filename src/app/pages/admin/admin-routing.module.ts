import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { DashboardComponent } from '../admin/pages/dashboard/dashboard.component';
import AuthGuard from 'src/app/guards/auth.guard';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { DaycareRequestsComponent } from './daycare-requests/daycare-requests.component';
import { DaycareRegisteredComponent } from './daycare-registered/daycare-registered.component';

const routes: Routes = [
  {
    path: 'login',
    component: AdminLoginComponent,
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'daycare/requests',
        component: DaycareRequestsComponent,
      },
      {
        path: 'daycare/registered',
        component: DaycareRegisteredComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
