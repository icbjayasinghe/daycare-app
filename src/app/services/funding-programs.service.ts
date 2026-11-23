import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FundingProgramDto } from '../models/funding-programs.model';

@Injectable({
  providedIn: 'root',
})
export class FundingProgramsService {
  constructor(private http: HttpClient) {}

  getFundingPrograms(
    active?: boolean,
    fundingType?: string,
  ): Observable<FundingProgramDto[]> {
    const url = `${environment.baseUrl}/api/funding-programs`;
    if (active === undefined && fundingType === undefined) {
      return this.http.get<FundingProgramDto[]>(url);
    } else if (active === undefined) {
      return this.http.get<FundingProgramDto[]>(
        `${url}?fundingType=${fundingType}`,
      );
    } else if (fundingType === undefined) {
      return this.http.get<FundingProgramDto[]>(`${url}?active=${active}`);
    } else {
      return this.http.get<FundingProgramDto[]>(
        `${url}?active=${active}&fundingType=${fundingType}`,
      );
    }
  }

  // createFundingProgram(fundingProgramData: any): Observable<any> {
  //   const url = `${environment.baseUrl}/api/funding-programs`;
  //   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  //   return this.http.post(url, fundingProgramData, { headers });
  // }

  // updateFundingProgram(fundingProgramData: any): Observable<any> {
  //   const url = `${environment.baseUrl}/api/funding-programs/${fundingProgramData.id}`;
  //   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  //   return this.http.put(url, fundingProgramData, { headers });
  // }
}
