import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { of, throwError } from 'rxjs';
import {
  DaycareProfile,
  DaycareStatus,
} from 'src/app/models/daycare.model';
import { DaycareService } from 'src/app/services/daycare.service';

import { DaycareRegisteredComponent } from './daycare-registered.component';

describe('DaycareRegisteredComponent', () => {
  let component: DaycareRegisteredComponent;
  let fixture: ComponentFixture<DaycareRegisteredComponent>;
  let daycareService: jasmine.SpyObj<DaycareService>;
  const daycares: DaycareProfile[] = [
    {
      id: 22,
      name: 'Willow Grove',
      telephone: '555-0177',
      status: DaycareStatus.APPROVED,
      owners: [
        {
          firstName: 'Morgan',
          lastName: 'Lee',
          email: 'morgan@example.com',
          phoneNumber: '555-0177',
        },
      ],
      address: {
        apartment: '',
        address: '81 Willow Lane',
        city: 'Portland',
        state: 'OR',
        postalCode: '97035',
        country: 'USA',
      },
    },
  ];

  beforeEach(async () => {
    daycareService = jasmine.createSpyObj<DaycareService>(
      'DaycareService',
      ['getDaycares'],
    );
    daycareService.getDaycares.and.returnValue(of(daycares));

    await TestBed.configureTestingModule({
      declarations: [DaycareRegisteredComponent],
      imports: [CommonModule],
      providers: [{ provide: DaycareService, useValue: daycareService }],
    }).compileComponents();

    fixture = TestBed.createComponent(DaycareRegisteredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads and displays approved daycare records', () => {
    expect(daycareService.getDaycares).toHaveBeenCalledWith(
      DaycareStatus.APPROVED,
    );
    expect(component.daycares).toEqual(daycares);
    expect(fixture.nativeElement.textContent).toContain('Willow Grove');
    expect(fixture.nativeElement.textContent).toContain('Morgan Lee');
    expect(fixture.nativeElement.textContent).toContain('APPROVED');
  });

  it('shows an empty state when no approved daycares are returned', () => {
    daycareService.getDaycares.and.returnValue(of([]));

    component.loadApprovedDaycares();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(
      'There are no approved daycares yet.',
    );
  });

  it('shows a retryable error when loading approved daycares fails', () => {
    daycareService.getDaycares.and.returnValue(
      throwError(() => new Error('Request failed')),
    );

    component.loadApprovedDaycares();
    fixture.detectChanges();

    expect(component.loading).toBeFalse();
    expect(component.errorMessage).toBe(
      'Unable to load registered daycares. Please try again.',
    );
    expect(fixture.nativeElement.querySelector('.retry-button')).toBeTruthy();
  });
});
