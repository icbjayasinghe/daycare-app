import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { PagesComponent } from './pages.component';
import { HeaderComponent } from '../static/header/header.component';
import { FooterComponent } from '../static/footer/footer.component';
import { HomeComponent } from './home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ParentSignupDialogComponent } from './dialog/parent-signup-dialog/parent-signup-dialog.component';
import { MaterialModule } from '../shared/material.module';
import { ParentDashboardComponent } from './parent/pages/parent-dashboard/parent-dashboard.component';

@NgModule({
  declarations: [
    DashboardComponent,
    NotFoundComponent,
    PagesComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    ParentSignupDialogComponent,
    ParentDashboardComponent,
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class PagesModule {}
