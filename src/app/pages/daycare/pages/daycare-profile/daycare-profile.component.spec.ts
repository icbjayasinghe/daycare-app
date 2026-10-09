import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { DaycareProfile } from 'src/app/models/daycare.model';
import { DaycareService } from 'src/app/services/daycare.service';

import { DaycareProfileComponent } from './daycare-profile.component';

describe('DaycareProfileComponent', () => {
  let component: DaycareProfileComponent;
  let fixture: ComponentFixture<DaycareProfileComponent>;
  let daycareService: jasmine.SpyObj<DaycareService>;
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
    },
  };

  beforeEach(async () => {
    localStorage.setItem('userEmail', 'provider@example.com');
    daycareService = jasmine.createSpyObj<DaycareService>('DaycareService', [
      'getMyDaycare',
      'updateMyDaycare',
    ]);
    daycareService.getMyDaycare.and.returnValue(of(profile));

    await TestBed.configureTestingModule({
      declarations: [DaycareProfileComponent],
      imports: [ReactiveFormsModule],
      providers: [{ provide: DaycareService, useValue: daycareService }],
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
});
