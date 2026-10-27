import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DaycareDashboardDto } from '../models/daycare-dashboard.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private http: HttpClient) {}

  getMyDaycareDashboardData(email: string): Observable<DaycareDashboardDto> {
    return this.http.get<DaycareDashboardDto>(
      `${environment.baseUrl}/api/daycare/${encodeURIComponent(email)}/dashboard`,
    );
  }
}
