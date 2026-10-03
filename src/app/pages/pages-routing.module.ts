import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { ParentDashboardComponent } from './parent/parent-dashboard/parent-dashboard.component';
import { ParentAuthGuard } from '../guards/parent-auth.guard';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'dashboard', component: DashboardComponent },
      {
        path: 'parent/dashboard',
        component: ParentDashboardComponent,
        canActivate: [ParentAuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
