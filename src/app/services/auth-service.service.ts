import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginResponse } from '../models/login-response.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  private readonly tokenKey = 'accessToken';

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    const url = `${environment.baseUrl}/api/user/login`;
    return this.http.post<LoginResponse>(url, {
      email,
      password,
    });
  }

  establishParentSession(response: LoginResponse): boolean {
    localStorage.removeItem(this.tokenKey);
    if (
      !response?.accessToken ||
      !this.tokenHasParentRole(response.accessToken)
    ) {
      return false;
    }

    localStorage.setItem(this.tokenKey, response.accessToken);
    return true;
  }

  hasParentAccess(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    return !!token && this.tokenHasParentRole(token);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  private tokenHasParentRole(token: string): boolean {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return false;
      }
      const encodedPayload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(
        atob(
          encodedPayload + '='.repeat((4 - (encodedPayload.length % 4)) % 4),
        ),
      );
      if (payload.exp && payload.exp * 1000 <= Date.now()) {
        return false;
      }

      const roleClaims = [
        payload.role,
        payload.roles,
        payload.authorities,
        payload.realm_access?.roles,
      ];
      const roles = roleClaims.reduce(
        (all: unknown[], claim: unknown) =>
          all.concat(Array.isArray(claim) ? claim : [claim]),
        [],
      );
      return roles.some(
        (role) =>
          typeof role === 'string' &&
          role.toUpperCase().replace(/^ROLE_/, '') === 'PARENT',
      );
    } catch {
      return false;
    }
  }
}
