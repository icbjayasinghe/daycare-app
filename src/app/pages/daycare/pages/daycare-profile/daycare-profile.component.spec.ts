import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SecurityContext } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { of } from 'rxjs';
import { DaycareProfile } from 'src/app/models/daycare.model';
import { DaycareService } from 'src/app/services/daycare.service';
import { DaycareConfigComponent } from '../../dialog/daycare-config/daycare-config.component';

import { DaycareProfileComponent } from './daycare-profile.component';

describe('DaycareProfileComponent', () => {
  let component: DaycareProfileComponent;
  let fixture: ComponentFixture<DaycareProfileComponent>;
  let daycareService: jasmine.SpyObj<DaycareService>;
  let dialog: jasmine.SpyObj<MatDialog>;
  const profile: DaycareProfile = {
    name: 'Little Steps',
    telephone: '555-0100',
    owners: [
      {
        firstName: 'Jamie',
        lastName: 'Lee',
        email: 'jamie@example.com',
        phoneNumber: '555-0101',
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
  };

  beforeEach(async () => {
    localStorage.setItem('userEmail', 'provider@example.com');
    daycareService = jasmine.createSpyObj<DaycareService>('DaycareService', [
      'getMyDaycare',
      'updateMyDaycare',
    ]);
    dialog = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);
    daycareService.getMyDaycare.and.returnValue(of(profile));

    await TestBed.configureTestingModule({
      declarations: [DaycareProfileComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: DaycareService, useValue: daycareService },
        { provide: MatDialog, useValue: dialog },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DaycareProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads profile details and saves edited values', () => {
    fixture.detectChanges();
    expect(component.profileForm.get('name')?.value).toBe('Little Steps');
    expect(daycareService.getMyDaycare).toHaveBeenCalledWith(
      'provider@example.com',
    );

    component.startEditing();
    component.profileForm.patchValue({ name: 'Bright Steps' });
    daycareService.updateMyDaycare.and.returnValue(
      of({ ...profile, name: 'Bright Steps' }),
    );
    component.saveProfile();

    expect(daycareService.updateMyDaycare).toHaveBeenCalled();
    expect(component.profile?.name).toBe('Bright Steps');
    expect(component.isEditing).toBeFalse();
  });

  it('opens the daycare configuration dialog', () => {
    component.openDaycareConfig();

    expect(dialog.open).toHaveBeenCalledWith(
      DaycareConfigComponent,
      jasmine.objectContaining({
        data: profile,
      }),
    );
  });

  it('uses geocode coordinates and previews the edited address', () => {
    const sanitizer = TestBed.inject(DomSanitizer);
    expect(component.mapQuery).toBe('37.7749,-122.4194');

    component.startEditing();
    component.profileForm.get('address.address')?.setValue('20 Oak Road');

    expect(component.mapQuery).toContain('20 Oak Road');
    expect(
      sanitizer.sanitize(SecurityContext.RESOURCE_URL, component.mapUrl),
    ).toContain('20%20Oak%20Road');
  });
});
