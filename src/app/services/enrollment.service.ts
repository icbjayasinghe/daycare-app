import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { DayCareEnrollmentDto, EnrollmentStatus } from '../models/enrollment.model';

@Injectable({
  providedIn: 'root',
})
export class EnrollmentService {
  constructor(private http: HttpClient) {}

  getMyEnrollmentsByStatus(
    parentEmail: string,
    daycareEmail: string,
    status: EnrollmentStatus | '',
  ): Observable<DayCareEnrollmentDto[]> {
    if (daycareEmail === '') {
      if (status === '') {
        return this.http.get<DayCareEnrollmentDto[]>(
          `${environment.baseUrl}/api/enrollment?loggedInParentEmail=${encodeURIComponent(parentEmail)}`,
        );
      } else {
        return this.http.get<DayCareEnrollmentDto[]>(
          `${environment.baseUrl}/api/enrollment?loggedInParentEmail=${encodeURIComponent(parentEmail)}&status=${encodeURIComponent(status)}`,
        );
      }
    } else {
      if (status === '') {
        return this.http.get<DayCareEnrollmentDto[]>(
          `${environment.baseUrl}/api/enrollment?loggedInDayCareEmail=${encodeURIComponent(daycareEmail)}`,
        );
      } else {
        return this.http.get<DayCareEnrollmentDto[]>(
          `${environment.baseUrl}/api/enrollment?loggedInDayCareEmail=${encodeURIComponent(daycareEmail)}&status=${encodeURIComponent(status)}`,
        );
      }
    }
  }
}
