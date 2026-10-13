import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  ApplicationStatus,
  DayCareApplicationDto,
} from '../models/daycare-application.model';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  constructor(private http: HttpClient) {}

  getMyApplications(
    parentEmail: string,
    daycareEmail: string,
  ): Observable<DayCareApplicationDto[]> {
    if (daycareEmail === '') {
      return this.http.get<DayCareApplicationDto[]>(
        `${environment.baseUrl}/api/application?loggedInParentEmail=${encodeURIComponent(parentEmail)}`,
      );
    } else {
      return this.http.get<DayCareApplicationDto[]>(
        `${environment.baseUrl}/api/application?loggedInDayCareEmail=${encodeURIComponent(daycareEmail)}`,
      );
    }
  }

  getMyApplicationsByStatus(
    parentEmail: string,
    daycareEmail: string,
    status: ApplicationStatus | '',
  ): Observable<DayCareApplicationDto[]> {
    if (daycareEmail === '') {
      if (status === '') {
        return this.http.get<DayCareApplicationDto[]>(
          `${environment.baseUrl}/api/application?loggedInParentEmail=${encodeURIComponent(parentEmail)}`,
        );
      } else {
        return this.http.get<DayCareApplicationDto[]>(
          `${environment.baseUrl}/api/application?loggedInParentEmail=${encodeURIComponent(parentEmail)}&status=${encodeURIComponent(status)}`,
        );
      }
    } else {
      if (status === '') {
        return this.http.get<DayCareApplicationDto[]>(
          `${environment.baseUrl}/api/application?loggedInDayCareEmail=${encodeURIComponent(daycareEmail)}`,
        );
      } else {
        return this.http.get<DayCareApplicationDto[]>(
          `${environment.baseUrl}/api/application?loggedInDayCareEmail=${encodeURIComponent(daycareEmail)}&status=${encodeURIComponent(status)}`,
        );
      }
    }
  }

  updateApplicationStatus(
    application: DayCareApplicationDto,
  ): Observable<DayCareApplicationDto> {
    const url = `${environment.baseUrl}/api/application`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.put<DayCareApplicationDto>(url, application, { headers });
  }
}
