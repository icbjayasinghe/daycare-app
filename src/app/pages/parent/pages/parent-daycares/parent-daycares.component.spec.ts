import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SecurityContext } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { of } from 'rxjs';
import { DaycareProfile } from 'src/app/models/daycare.model';
import { MaterialModule } from 'src/app/shared/material.module';
import { DaycareService } from 'src/app/services/daycare.service';
import { ApplyChildDialogComponent } from '../../dialog/apply-child-dialog/apply-child-dialog.component';

import { ParentDaycaresComponent } from './parent-daycares.component';

describe('ParentDaycaresComponent', () => {
  let component: ParentDaycaresComponent;
  let fixture: ComponentFixture<ParentDaycaresComponent>;
  let daycareService: jasmine.SpyObj<DaycareService>;
  let dialog: jasmine.SpyObj<MatDialog>;
  const daycares: DaycareProfile[] = [
    {
      name: 'Little Steps',
      telephone: '555-0100',
      owners: [
        {
          firstName: 'Jamie',
          lastName: 'Lee',
          email: 'jamie@littlesteps.example',
          phoneNumber: '555-0102',
        },
      ],
      address: {
        apartment: '',
        address: '10 Main Street',
        city: 'Springfield',
        state: 'CA',
        postalCode: '90000',
        country: 'USA',
        latitude: 37.7749,
        longitude: -122.4194,
      },
    },
    {
      name: 'Bright Start',
      telephone: '555-0101',
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
  ];

  beforeEach(async () => {
    daycareService = jasmine.createSpyObj<DaycareService>(
      'DaycareService',
      ['getDaycares'],
    );
    dialog = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);
    daycareService.getDaycares.and.returnValue(of(daycares));

    await TestBed.configureTestingModule({
      declarations: [ParentDaycaresComponent],
      imports: [MaterialModule],
      providers: [
        { provide: DaycareService, useValue: daycareService },
        { provide: MatDialog, useValue: dialog },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ParentDaycaresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads daycare rows and shows the first daycare on the map', () => {
    const sanitizer = TestBed.inject(DomSanitizer);

    expect(daycareService.getDaycares).toHaveBeenCalled();
    expect(component.daycares).toEqual(daycares);
    expect(component.selectedDaycare).toBe(daycares[0]);
    expect(
      sanitizer.sanitize(SecurityContext.RESOURCE_URL, component.mapUrl),
    ).toContain('37.7749%2C-122.4194');
  });

  it('updates the map when another daycare is selected', () => {
    const sanitizer = TestBed.inject(DomSanitizer);

    component.selectDaycare(daycares[1]);

    expect(component.selectedDaycare).toBe(daycares[1]);
    expect(
      sanitizer.sanitize(SecurityContext.RESOURCE_URL, component.mapUrl),
    ).toContain('20%20Oak%20Road');
  });

  it('reveals contact details when their action icons are selected', () => {
    component.toggleTelephone(daycares[0]);
    component.toggleEmail(daycares[0]);

    expect(component.visibleTelephoneNumbers.has(daycares[0])).toBeTrue();
    expect(component.getDaycareEmail(daycares[0])).toBe(
      'jamie@littlesteps.example',
    );
    expect(component.visibleEmails.has(daycares[0])).toBeTrue();

    component.toggleTelephone(daycares[0]);
    component.toggleEmail(daycares[0]);

    expect(component.visibleTelephoneNumbers.has(daycares[0])).toBeFalse();
    expect(component.visibleEmails.has(daycares[0])).toBeFalse();
  });

  it('opens the apply-child dialog for the selected daycare', () => {
    component.openApplyDialog(daycares[0]);

    expect(dialog.open).toHaveBeenCalledWith(ApplyChildDialogComponent, {
      data: daycares[0],
    });
  });
});
