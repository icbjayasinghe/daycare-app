import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DaycareConfigDto } from '../models/daycare-config.model';

@Injectable({
  providedIn: 'root',
})
export class DaycareConfigService {
  constructor(private http: HttpClient) {}

  registerDaycareConfig(daycareConfig: DaycareConfigDto): Observable<any> {
    const url = `${environment.baseUrl}/api/daycare-config`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(`${url}`, daycareConfig, { headers });
  }

  getDaycareConfig(configId: number): Observable<DaycareConfigDto> {
    return this.http.get<DaycareConfigDto>(
      `${environment.baseUrl}/api/daycare-config/${configId}`,
    );
  }

  updateDaycareConfig(
    daycareConfig: DaycareConfigDto,
  ): Observable<DaycareConfigDto> {
    return this.http.put<DaycareConfigDto>(
      `${environment.baseUrl}/api/daycare-config/${daycareConfig.daycareId}`,
      daycareConfig,
    );
  }
}
