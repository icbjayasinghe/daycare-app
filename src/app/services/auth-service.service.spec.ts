import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AuthServiceService } from './auth-service.service';

describe('AuthServiceService', () => {
  let service: AuthServiceService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(AuthServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('stores the login email and removes it on logout', () => {
    const payload = btoa(JSON.stringify({ role: 'PARENT' }));
    const token = `header.${payload}.signature`;

    expect(
      service.establishParentSession(
        { accessToken: token },
        ' parent@example.com ',
      ),
    ).toBeTrue();
    expect(localStorage.getItem('userEmail')).toBe('parent@example.com');

    service.logout();

    expect(localStorage.getItem('userEmail')).toBeNull();
  });

  it('establishes an admin session only for admin roles', () => {
    const adminToken = `header.${btoa(JSON.stringify({ role: 'ADMIN' }))}.signature`;
    const parentToken = `header.${btoa(JSON.stringify({ role: 'PARENT' }))}.signature`;

    expect(
      service.establishAdminSession(
        { accessToken: adminToken },
        'admin@example.com',
      ),
    ).toBeTrue();
    expect(localStorage.getItem('userEmail')).toBe('admin@example.com');

    expect(
      service.establishAdminSession(
        { accessToken: parentToken },
        'parent@example.com',
      ),
    ).toBeFalse();
    expect(localStorage.getItem('accessToken')).toBeNull();
    expect(localStorage.getItem('userEmail')).toBeNull();
  });
});
