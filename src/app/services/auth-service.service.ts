import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { LoginResponse } from '../models/login-response.model';
import { environment } from 'src/environments/environment';

export interface ParentProfile {
  givenName: string;
  familyName: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  private readonly tokenKey = 'accessToken';
  private readonly parentAuthenticatedSubject = new BehaviorSubject<boolean>(
    false,
  );
  readonly parentAuthenticated$ =
    this.parentAuthenticatedSubject.asObservable();
  private readonly parentProfileSubject =
    new BehaviorSubject<ParentProfile | null>(null);
  readonly parentProfile$ = this.parentProfileSubject.asObservable();

  constructor(private http: HttpClient) {
    this.refreshSessionState();
  }

  login(email: string, password: string) {
    const url = `${environment.baseUrl}/api/user/login`;
    return this.http.post<LoginResponse>(url, {
      email,
      password,
    });
  }

  establishParentSession(response: LoginResponse): boolean {
    localStorage.removeItem(this.tokenKey);
    const profile = response?.accessToken
      ? this.readParentProfile(response.accessToken)
      : null;
    if (!profile) {
      this.clearSessionState();
      return false;
    }

    localStorage.setItem(this.tokenKey, response.accessToken);
    this.parentProfileSubject.next(profile);
    this.parentAuthenticatedSubject.next(true);
    return true;
  }

  hasParentAccess(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    return !!token && !!this.readParentProfile(token);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.clearSessionState();
  }

  private refreshSessionState(): void {
    const token = localStorage.getItem(this.tokenKey);
    const profile = token ? this.readParentProfile(token) : null;
    this.parentProfileSubject.next(profile);
    this.parentAuthenticatedSubject.next(!!profile);
    if (token && !profile) {
      localStorage.removeItem(this.tokenKey);
    }
  }

  private clearSessionState(): void {
    this.parentProfileSubject.next(null);
    this.parentAuthenticatedSubject.next(false);
  }

  private readParentProfile(token: string): ParentProfile | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }
      const encodedPayload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(
        atob(
          encodedPayload + '='.repeat((4 - (encodedPayload.length % 4)) % 4),
        ),
      );
      if (payload.exp && payload.exp * 1000 <= Date.now()) {
        return null;
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
      const hasParentRole = roles.some(
        (role) =>
          typeof role === 'string' &&
          role.toUpperCase().replace(/^ROLE_/, '') === 'PARENT',
      );
      if (!hasParentRole) {
        return null;
      }

      return {
        givenName: typeof payload.given_name === 'string' ? payload.given_name : '',
        familyName: typeof payload.family_name === 'string' ? payload.family_name : '',
        role: 'PARENT',
      };
    } catch {
      return null;
    }
  }
}
