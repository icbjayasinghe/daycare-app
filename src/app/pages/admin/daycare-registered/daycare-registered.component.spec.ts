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
    {
      id: 23,
      name: 'Pinecone Place',
      telephone: '555-0199',
      status: DaycareStatus.DEACTIVATED,
      owners: [
        {
          firstName: 'Jamie',
          lastName: 'Chen',
          email: 'jamie@example.com',
          phoneNumber: '555-0199',
        },
      ],
      address: {
        apartment: '',
        address: '9 Pine Street',
        city: 'Portland',
        state: 'OR',
        postalCode: '97035',
        country: 'USA',
      },
    },
  ];

  beforeEach(async () => {
    daycares[0].status = DaycareStatus.APPROVED;
    daycares[1].status = DaycareStatus.DEACTIVATED;
    daycareService = jasmine.createSpyObj<DaycareService>(
      'DaycareService',
      ['getDaycares', 'updateMyDaycare'],
    );
    daycareService.getDaycares.and.returnValue(of(daycares));
    daycareService.updateMyDaycare.and.callFake((daycare) => of(daycare));

    await TestBed.configureTestingModule({
      declarations: [DaycareRegisteredComponent],
      imports: [CommonModule],
      providers: [{ provide: DaycareService, useValue: daycareService }],
    }).compileComponents();

    fixture = TestBed.createComponent(DaycareRegisteredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('loads all daycares and initially displays only approved records', () => {
    expect(daycareService.getDaycares).toHaveBeenCalledWith();
    expect(component.daycares).toEqual(daycares);
    expect(component.filteredDaycares).toEqual([daycares[0]]);
    expect(fixture.nativeElement.textContent).toContain('Willow Grove');
    expect(fixture.nativeElement.textContent).not.toContain('Pinecone Place');
  });

  it('shows all records and an activate action in the All filter', () => {
    component.onFilterChange(createFilterEvent('ALL'));
    fixture.detectChanges();

    expect(component.filteredDaycares).toEqual(daycares);
    expect(fixture.nativeElement.textContent).toContain('Pinecone Place');
    expect(
      fixture.nativeElement.querySelector('.activate-button'),
    ).toBeTruthy();
  });

  it('shows an empty state when no daycares are returned', () => {
    daycareService.getDaycares.and.returnValue(of([]));

    component.loadDaycares();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(
      'There are no approved daycares yet.',
    );
  });

  it('shows a retryable error when loading daycares fails', () => {
    daycareService.getDaycares.and.returnValue(
      throwError(() => new Error('Request failed')),
    );

    component.loadDaycares();
    fixture.detectChanges();

    expect(component.loading).toBeFalse();
    expect(component.errorMessage).toBe('Unable to load daycares. Please try again.');
    expect(fixture.nativeElement.querySelector('.retry-button')).toBeTruthy();
  });

  it('deactivates an approved daycare and hides it from the Approved filter', () => {
    component.deactivateDaycare(daycares[0]);

    expect(daycareService.updateMyDaycare).toHaveBeenCalledWith(
      jasmine.objectContaining({
        id: 22,
        status: DaycareStatus.DEACTIVATED,
      }),
    );
    expect(daycares[0].status).toBe(DaycareStatus.DEACTIVATED);
    expect(component.daycares).toContain(daycares[0]);
    expect(component.filteredDaycares).not.toContain(daycares[0]);
  });

  it('reactivates a deactivated daycare as approved', () => {
    component.onFilterChange(createFilterEvent('ALL'));

    component.activateDaycare(daycares[1]);

    expect(daycareService.updateMyDaycare).toHaveBeenCalledWith(
      jasmine.objectContaining({
        id: 23,
        status: DaycareStatus.APPROVED,
      }),
    );
    expect(daycares[1].status).toBe(DaycareStatus.APPROVED);
    component.onFilterChange(createFilterEvent(DaycareStatus.APPROVED));
    expect(component.filteredDaycares).toContain(daycares[1]);
  });

  it('keeps the previous status and shows an error if an update fails', () => {
    daycareService.updateMyDaycare.and.returnValue(
      throwError(() => new Error('Request failed')),
    );

    component.deactivateDaycare(daycares[0]);

    expect(daycares[0].status).toBe(DaycareStatus.APPROVED);
    expect(component.filteredDaycares).toContain(daycares[0]);
    expect(component.statusUpdateError).toBe(
      'Unable to update the daycare status. Please try again.',
    );
    expect(component.updatingDaycareIds.size).toBe(0);
  });
});

function createFilterEvent(value: string): Event {
  const select = document.createElement('select');
  const option = document.createElement('option');
  option.value = value;
  select.appendChild(option);
  select.value = value;
  const event = new Event('change');
  Object.defineProperty(event, 'target', { value: select });
  return event;
}
