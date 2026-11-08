import { Injectable } from '@angular/core';
import { FeePlanDto } from '../models/fee-plan.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(private http: HttpClient) {}

  addFeePlan(feePlan: FeePlanDto): Observable<FeePlanDto> {
    const url = `${environment.baseUrl}/api/fee-plans`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<FeePlanDto>(url, feePlan, { headers });
  }
}
