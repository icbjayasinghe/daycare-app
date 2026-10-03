import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthServiceService } from '../services/auth-service.service';

@Injectable({
  providedIn: 'root',
})
export class ParentAuthGuard implements CanActivate {
  constructor(
    private authService: AuthServiceService,
    private router: Router,
  ) {}

  canActivate(): boolean | UrlTree {
    return this.authService.hasParentAccess() || this.router.parseUrl('/pages/home');
  }
}