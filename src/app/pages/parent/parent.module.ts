import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ParentRoutingModule } from './parent-routing.module';
import { ParentLayoutComponent } from './parent-layout/parent-layout.component';
import { ParentSidebarComponent } from './components/parent-sidebar/parent-sidebar.component';
import { ParentDashboardComponent } from './pages/parent-dashboard/parent-dashboard.component';
import { RouterModule } from '@angular/router';
import { ParentDaycaresComponent } from './pages/parent-daycares/parent-daycares.component';

@NgModule({
  declarations: [
    ParentLayoutComponent,
    ParentSidebarComponent,
    ParentDashboardComponent,
    ParentDaycaresComponent,
  ],
  imports: [CommonModule, ParentRoutingModule, RouterModule],
})
export class ParentModule {}
