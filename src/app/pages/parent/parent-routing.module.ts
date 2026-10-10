import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ParentLayoutComponent } from './parent-layout/parent-layout.component';
import { ParentDashboardComponent } from './pages/parent-dashboard/parent-dashboard.component';
import AuthGuard from 'src/app/guards/auth.guard';
import { ParentDaycaresComponent } from './pages/parent-daycares/parent-daycares.component';
import { ParentChildrenComponent } from './pages/parent-children/parent-children.component';
import { ParentProfileComponent } from './pages/parent-profile/parent-profile.component';

const routes: Routes = [
  {
    path: '',
    component: ParentLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        component: ParentDashboardComponent,
        canActivate: [AuthGuard],
        data: { roles: ['PARENT'] },
      },
      {
        path: 'daycares',
        component: ParentDaycaresComponent,
        canActivate: [AuthGuard],
        data: { roles: ['PARENT'] },
      },
      {
        path: 'children',
        component: ParentChildrenComponent,
        canActivate: [AuthGuard],
        data: { roles: ['PARENT'] },
      },
      {
        path: 'profile',
        component: ParentProfileComponent,
        canActivate: [AuthGuard],
        data: { roles: ['PARENT'] },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParentRoutingModule {}
