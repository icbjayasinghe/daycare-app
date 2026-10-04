import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ParentRoutingModule } from './parent-routing.module';
import { ParentLayoutComponent } from './parent-layout/parent-layout.component';
import { ParentSidebarComponent } from './components/parent-sidebar/parent-sidebar.component';
import { ParentDashboardComponent } from './pages/parent-dashboard/parent-dashboard.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    ParentLayoutComponent,
    ParentSidebarComponent,
    ParentDashboardComponent,
  ],
  imports: [CommonModule, ParentRoutingModule, RouterModule],
})
export class ParentModule {}
