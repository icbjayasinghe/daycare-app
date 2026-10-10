// import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ParentDto, ParentProfileDto } from '../models/parent.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ParentService {
  constructor(private http: HttpClient) {}

  registerParent(parentData: ParentDto): Observable<ParentDto> {
    const url = `${environment.baseUrl}/api/parent`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<ParentDto>(url, parentData, { headers });
  }

  getMyParent(email: string): Observable<ParentProfileDto> {
    return this.http.get<ParentProfileDto>(
      `${environment.baseUrl}/api/parent/byEmail/${encodeURIComponent(email)}`,
    );
  }

  updateMyParent(profile: ParentProfileDto): Observable<ParentProfileDto> {
    return this.http.put<ParentProfileDto>(
      `${environment.baseUrl}/api/parent`,
      profile,
    );
  }
}
