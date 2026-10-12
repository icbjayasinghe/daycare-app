import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DayCareApplicationDto } from '../models/daycare-application.model';

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
}
