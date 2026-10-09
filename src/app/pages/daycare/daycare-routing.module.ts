import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DaycareLayoutComponent } from './daycare-layout/daycare-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DaycareProfileComponent } from './pages/daycare-profile/daycare-profile.component';
import AuthGuard from 'src/app/guards/auth.guard';

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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DaycareRoutingModule {}
