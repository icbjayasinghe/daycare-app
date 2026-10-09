import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { AuthInterceptor } from './auth.interceptor';

describe('AuthInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.setItem('accessToken', 'test-token');
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true,
        },
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.removeItem('accessToken');
  });

  it('adds the bearer token to API requests', () => {
    http.get(`${environment.baseUrl}/api/daycare`).subscribe();

    const request = httpMock.expectOne(`${environment.baseUrl}/api/daycare`);
    expect(request.request.headers.get('Authorization')).toBe(
      'Bearer test-token',
    );
    request.flush({});
  });

  it('does not add the bearer token to login requests', () => {
    http.post(`${environment.baseUrl}/api/user/login`, {}).subscribe();

    const request = httpMock.expectOne(`${environment.baseUrl}/api/user/login`);
    expect(request.request.headers.has('Authorization')).toBeFalse();
    request.flush({});
  });
});
