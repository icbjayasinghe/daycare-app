import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ParentLayoutComponent } from './parent-layout/parent-layout.component';
import { ParentDashboardComponent } from './pages/parent-dashboard/parent-dashboard.component';
import { ParentAuthGuard } from 'src/app/guards/parent-auth.guard';
import { ParentDaycaresComponent } from './pages/parent-daycares/parent-daycares.component';

const routes: Routes = [
  {
    path: '',
    component: ParentLayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: ParentDashboardComponent,
        canActivate: [ParentAuthGuard],
      },
      {
        path: 'daycares',
        component: ParentDaycaresComponent,
        canActivate: [ParentAuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParentRoutingModule {}
