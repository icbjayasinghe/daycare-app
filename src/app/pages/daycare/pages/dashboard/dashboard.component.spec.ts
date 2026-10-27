import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { of, throwError } from 'rxjs';
import { ApplicationStatus } from 'src/app/models/daycare-application.model';
import { DaycareDashboardDto } from 'src/app/models/daycare-dashboard.model';
import { DashboardService } from 'src/app/services/dashboard.service';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let dashboardService: jasmine.SpyObj<DashboardService>;
  const dashboardData: DaycareDashboardDto = {
    daycareId: 7,
    totalCapacity: 30,
    enrolledChildren: 22,
    availableSpaces: 8,
    occupancyRate: 73.3,
    applications: { PENDING: 4, ACCEPTED: 2 },
    recentApplications: [
      {
        id: 1,
        child: {
          id: 8,
          firstName: 'Sam',
          lastName: 'Jones',
          dob: '2021-03-15',
          sex: 'FEMALE',
        },
        dayCare: {
          id: 7,
          name: 'Bright Start',
          telephone: '555-0140',
          owners: [],
          address: {
            apartment: '',
            address: '20 Oak Road',
            city: 'Springfield',
            state: 'CA',
            postalCode: '90000',
            country: 'USA',
          },
        },
        status: ApplicationStatus.PENDING,
        appliedAt: '2026-10-10T12:00:00Z',
      },
    ],
  };

  beforeEach(async () => {
    localStorage.setItem('userEmail', 'daycare@example.com');
    dashboardService = jasmine.createSpyObj<DashboardService>(
      'DashboardService',
      ['getMyDaycareDashboardData'],
    );
    dashboardService.getMyDaycareDashboardData.and.returnValue(
      of(dashboardData),
    );

    await TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [DashboardComponent],
      providers: [{ provide: DashboardService, useValue: dashboardService }],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => localStorage.removeItem('userEmail'));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads and displays dashboard data for the signed-in daycare', () => {
    expect(dashboardService.getMyDaycareDashboardData).toHaveBeenCalledWith(
      'daycare@example.com',
    );
    expect(component.dashboardData).toEqual(dashboardData);
    expect(fixture.nativeElement.textContent).toContain('30');
    expect(fixture.nativeElement.textContent).toContain('22');
    expect(fixture.nativeElement.textContent).toContain('8');
    expect(fixture.nativeElement.textContent).toContain('73.3%');
    expect(fixture.nativeElement.textContent).toContain('PENDING');
    expect(fixture.nativeElement.textContent).toContain('Sam Jones');
  });

  it('shows an error and retry button when dashboard data fails to load', () => {
    dashboardService.getMyDaycareDashboardData.and.returnValue(
      throwError(() => new Error('Request failed')),
    );

    component.loadDashboard();
    fixture.detectChanges();

    expect(component.loading).toBeFalse();
    expect(component.errorMessage).toBe(
      'Unable to load your daycare dashboard. Please try again.',
    );
    expect(fixture.nativeElement.querySelector('.retry-button')).toBeTruthy();
  });
});
