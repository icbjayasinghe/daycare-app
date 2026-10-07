import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { ParentDashboardComponent } from './parent/pages/parent-dashboard/parent-dashboard.component';
import AuthGuard from '../guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'dashboard', component: DashboardComponent },
      {
        path: 'parent',
        loadChildren: () =>
          import('./parent/parent.module').then((m) => m.ParentModule),
      },
      {
        path: 'daycare',
        loadChildren: () =>
          import('./daycare/daycare.module').then((m) => m.DaycareModule),
      },
      {
        path: 'admin',
        loadChildren: () =>
          import('./admin/admin.module').then((m) => m.AdminModule),
      },
      // {
      //   path: 'parent/dashboard',
      //   component: ParentDashboardComponent,
      //   canActivate: [ParentAuthGuard],
      // },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
