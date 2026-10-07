import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  UrlTree,
} from '@angular/router';
import { AuthServiceService, UserRole } from '../services/auth-service.service';

@Injectable({
  providedIn: 'root',
})
export default class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthServiceService,
    private router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    if (!this.authService.hasAuthenticatedAccess()) {
      return this.router.parseUrl('/pages/home');
    }

    const requiredRoles = route.data['roles'] as UserRole[] | undefined;
    if (!requiredRoles?.length) {
      return true;
    }

    if (requiredRoles.some((role) => this.authService.hasRole(role))) {
      return true;
    }

    return this.router.parseUrl(
      this.authService.getRoleHomeRoute() ?? '/pages/home',
    );
  }
}
