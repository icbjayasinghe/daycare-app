import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { of, throwError } from 'rxjs';
import {
  DaycareProfile,
  DaycareStatus,
} from 'src/app/models/daycare.model';
import { DaycareService } from 'src/app/services/daycare.service';

import { DaycareRequestsComponent } from './daycare-requests.component';

describe('DaycareRequestsComponent', () => {
  let component: DaycareRequestsComponent;
  let fixture: ComponentFixture<DaycareRequestsComponent>;
  let daycareService: jasmine.SpyObj<DaycareService>;
  const daycares: DaycareProfile[] = [
    {
      id: 14,
      name: 'Little Oaks',
      telephone: '555-0102',
      status: DaycareStatus.PENDING,
      owners: [
        {
          firstName: 'Alex',
          lastName: 'Rivera',
          email: 'alex@example.com',
          phoneNumber: '555-0102',
        },
      ],
      address: {
        apartment: '',
        address: '10 Oak Street',
        city: 'Springfield',
        state: 'CA',
        postalCode: '90000',
        country: 'USA',
      },
    },
  ];

  beforeEach(async () => {
    daycares[0].status = DaycareStatus.PENDING;
    daycareService = jasmine.createSpyObj<DaycareService>(
      'DaycareService',
      ['getDaycares', 'updateMyDaycare'],
    );
    daycareService.getDaycares.and.returnValue(of(daycares));
    daycareService.updateMyDaycare.and.callFake((daycare) => of(daycare));

    await TestBed.configureTestingModule({
      declarations: [DaycareRequestsComponent],
      imports: [CommonModule],
      providers: [{ provide: DaycareService, useValue: daycareService }],
    }).compileComponents();

    fixture = TestBed.createComponent(DaycareRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads and displays pending daycare requests', () => {
    expect(daycareService.getDaycares).toHaveBeenCalledWith(
      DaycareStatus.PENDING,
    );
    expect(component.daycares).toEqual(daycares);
    expect(fixture.nativeElement.textContent).toContain('Little Oaks');
    expect(fixture.nativeElement.textContent).toContain('Alex Rivera');
    expect(fixture.nativeElement.textContent).toContain('PENDING');
  });

  it('shows an empty state when there are no pending requests', () => {
    daycareService.getDaycares.and.returnValue(of([]));

    component.loadPendingDaycares();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(
      'There are no pending daycare requests.',
    );
  });

  it('shows an error and permits retry when loading requests fails', () => {
    daycareService.getDaycares.and.returnValue(
      throwError(() => new Error('Request failed')),
    );

    component.loadPendingDaycares();
    fixture.detectChanges();

    expect(component.loading).toBeFalse();
    expect(component.errorMessage).toBe(
      'Unable to load pending daycare requests. Please try again.',
    );
    expect(fixture.nativeElement.querySelector('.retry-button')).toBeTruthy();
  });

  it('approves a daycare and removes it from the pending list', () => {
    component.updateStatus(daycares[0], DaycareStatus.APPROVED);

    expect(daycareService.updateMyDaycare).toHaveBeenCalledWith(
      jasmine.objectContaining({
        id: 14,
        status: DaycareStatus.APPROVED,
      }),
    );
    expect(daycares[0].status).toBe(DaycareStatus.APPROVED);
    expect(component.daycares).not.toContain(daycares[0]);
  });

  it('preserves the pending daycare and displays an error when the update fails', () => {
    daycareService.updateMyDaycare.and.returnValue(
      throwError(() => new Error('Request failed')),
    );

    component.updateStatus(daycares[0], DaycareStatus.REJECTED);

    expect(daycares[0].status).toBe(DaycareStatus.PENDING);
    expect(component.daycares).toContain(daycares[0]);
    expect(component.statusUpdateError).toBe(
      'Unable to update the daycare status. Please try again.',
    );
    expect(component.updatingDaycareIds.size).toBe(0);
  });
});
