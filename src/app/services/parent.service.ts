// import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ParentDto } from '../models/parent.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ParentService {
  constructor(private http: HttpClient) {}

  private apiUrl = 'api/parent'; // Replace with your actual API endpoint

  registerParent(parentData: ParentDto): Observable<ParentDto> | any {
    const url = `${environment.baseUrl}/api/parent`;

    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'Content-Type':  'application/json',

    //   })
    // };

    // return this.http.get<InventoryGrpItem[]>(url, httpOptions);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(`${url}`, parentData, { headers });
  }
}
