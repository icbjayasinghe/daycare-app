import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginResponse } from '../models/login-response.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  // private readonly apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    const url = `${environment.baseUrl}/api/user/login`;
    console.log('Login URL:', url, 'Email:', email, 'Password:', password);
    return this.http.post<LoginResponse>(`${url}`, {
      email,
      password,
    });
  }
}
