import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DaycareDto, DaycareProfile } from '../models/daycare.model';

@Injectable({
  providedIn: 'root',
})
export class DaycareService {
  constructor(private http: HttpClient) {}

  registerDaycare(daycareData: DaycareDto): Observable<any> {
    const url = `${environment.baseUrl}/api/daycare`;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(`${url}`, daycareData, { headers });
  }

  getMyDaycare(email: string): Observable<DaycareProfile> {
    return this.http.get<DaycareProfile>(
      `${environment.baseUrl}/api/daycare/byOwner/${encodeURIComponent(email)}`,
    );
  }

  updateMyDaycare(profile: DaycareProfile): Observable<DaycareProfile> {
    return this.http.put<DaycareProfile>(
      `${environment.baseUrl}/api/daycare/me`,
      profile,
    );
  }
}
