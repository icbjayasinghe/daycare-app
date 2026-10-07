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

export type UserRole = 'PARENT' | 'ADMIN' | 'PROVIDER';

const ROLE_HOME_ROUTES: Record<UserRole, string> = {
  PARENT: '/pages/parent/dashboard',
  ADMIN: '/pages/admin/dashboard',
  PROVIDER: '/pages/daycare/dashboard',
};

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
    if (!this.establishSession(response) || !this.hasRole('PARENT')) {
      this.logout();
      return false;
    }

    return true;
  }

  establishDaycareSession(response: LoginResponse): boolean {
    if (!this.establishSession(response) || !this.hasRole('PROVIDER')) {
      this.logout();
      return false;
    }

    return true;
  }

  establishSession(response: LoginResponse): boolean {
    localStorage.removeItem(this.tokenKey);
    const token = response?.accessToken;
    const roles = token ? this.readRoles(token) : [];
    if (!token || !roles.length) {
      this.clearSessionState();
      return false;
    }

    localStorage.setItem(this.tokenKey, token);
    this.refreshSessionState();
    return true;
  }

  hasParentAccess(): boolean {
    return this.hasRole('PARENT');
  }

  hasAuthenticatedAccess(): boolean {
    return this.getRoles().length > 0;
  }

  hasRole(role: UserRole): boolean {
    return this.getRoles().includes(role);
  }

  getRoles(): UserRole[] {
    const token = localStorage.getItem(this.tokenKey);
    return token ? this.readRoles(token) : [];
  }

  getRoleHomeRoute(): string | null {
    const roles = this.getRoles();
    const priority: UserRole[] = ['ADMIN', 'PROVIDER', 'PARENT'];
    const role = priority.find((candidate) => roles.includes(candidate));
    return role ? ROLE_HOME_ROUTES[role] : null;
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.clearSessionState();
  }

  private refreshSessionState(): void {
    const token = localStorage.getItem(this.tokenKey);
    const roles = token ? this.readRoles(token) : [];
    const profile = roles.includes('PARENT')
      ? this.readParentProfile(token!)
      : null;
    this.parentProfileSubject.next(profile);
    this.parentAuthenticatedSubject.next(!!profile);
    if (token && !roles.length) {
      localStorage.removeItem(this.tokenKey);
    }
  }

  private clearSessionState(): void {
    this.parentProfileSubject.next(null);
    this.parentAuthenticatedSubject.next(false);
  }

  private readParentProfile(token: string): ParentProfile | null {
    try {
      const payload = this.readTokenPayload(token);
      if (!payload || !this.readRoles(token).includes('PARENT')) {
        return null;
      }

      return {
        givenName:
          typeof payload.given_name === 'string' ? payload.given_name : '',
        familyName:
          typeof payload.family_name === 'string' ? payload.family_name : '',
        role: 'PARENT',
      };
    } catch {
      return null;
    }
  }

  private readRoles(token: string): UserRole[] {
    const payload = this.readTokenPayload(token);
    if (!payload) {
      return [];
    }

    const roleClaims: unknown[] = [
      payload.role,
      payload.roles,
      payload.authorities,
      payload.realm_access?.roles,
    ];
    const roles = roleClaims.reduce<unknown[]>(
      (all, claim) => all.concat(Array.isArray(claim) ? claim : [claim]),
      [],
    );
    const recognizedRoles: UserRole[] = ['PARENT', 'ADMIN', 'PROVIDER'];
    return recognizedRoles.filter((recognizedRole) =>
      roles.some(
        (role) =>
          typeof role === 'string' &&
          role.toUpperCase().replace(/^ROLE_/, '') === recognizedRole,
      ),
    );
  }

  private readTokenPayload(token: string): any | null {
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
      return payload.exp && payload.exp * 1000 <= Date.now() ? null : payload;
    } catch {
      return null;
    }
  }
}
