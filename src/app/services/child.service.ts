import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChildDto } from '../models/parent.model';
import { DayCareApplicationDto } from '../models/daycare-application.model';

@Injectable({
  providedIn: 'root',
})
export class ChildService {
  constructor(private http: HttpClient) {}

  registerChild(email: string, childData: ChildDto): Observable<any> {
    const url = `${environment.baseUrl}/api/child/byEmail/${encodeURIComponent(email)}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(`${url}`, childData, { headers });
  }

  getMyChildren(parentEmail: string): Observable<ChildDto[]> {
    return this.http.get<ChildDto[]>(
      `${environment.baseUrl}/api/child/byEmail/${encodeURIComponent(parentEmail)}`,
    );
  }

  applyDaycare(
    parentEmail: string,
    daycareId: number | string,
    application: DayCareApplicationDto,
  ): Observable<any> {
    const url = `${environment.baseUrl}/api/child/byEmail/${encodeURIComponent(parentEmail)}/request/${encodeURIComponent(daycareId)}`;
    return this.http.post(url, application);
  }

  // updateMyChild(childData: any): Observable<any> {
  //   return this.http.put(
  //     `${environment.baseUrl}/api/child`,
  //     childData
  //   );
  // }
}
