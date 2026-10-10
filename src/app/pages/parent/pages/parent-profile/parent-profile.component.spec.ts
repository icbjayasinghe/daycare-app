import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { ParentProfileDto } from 'src/app/models/parent.model';
import { ParentService } from 'src/app/services/parent.service';

import { ParentProfileComponent } from './parent-profile.component';

describe('ParentProfileComponent', () => {
  let component: ParentProfileComponent;
  let fixture: ComponentFixture<ParentProfileComponent>;
  let parentService: jasmine.SpyObj<ParentService>;
  const profile: ParentProfileDto = {
    id: 1,
    firstName: 'Jamie',
    lastName: 'Lee',
    email: 'parent@example.com',
    phone: '555-0101',
    address: {
      address: '10 Main Street',
      city: 'Springfield',
      state: 'CA',
      postalCode: '90000',
      country: 'USA',
    },
  };

  beforeEach(async () => {
    localStorage.setItem('userEmail', 'parent@example.com');
    parentService = jasmine.createSpyObj<ParentService>('ParentService', [
      'getMyParent',
      'updateMyParent',
    ]);
    parentService.getMyParent.and.returnValue(of(profile));

    await TestBed.configureTestingModule({
      declarations: [ParentProfileComponent],
      imports: [CommonModule, ReactiveFormsModule],
      providers: [{ provide: ParentService, useValue: parentService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ParentProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads and saves edited profile fields', () => {
    expect(component.profileForm.get('firstName')?.value).toBe('Jamie');
    expect(parentService.getMyParent).toHaveBeenCalledWith('parent@example.com');

    component.startEditing();
    component.profileForm.patchValue({
      firstName: 'Taylor',
      address: { address: '20 Oak Road' },
    });
    parentService.updateMyParent.and.returnValue(
      of({
        ...profile,
        firstName: 'Taylor',
        address: { ...profile.address, address: '20 Oak Road' },
      }),
    );
    component.saveProfile();

    expect(parentService.updateMyParent).toHaveBeenCalledWith(
      jasmine.objectContaining({
        firstName: 'Taylor',
        address: jasmine.objectContaining({ address: '20 Oak Road' }),
      }),
    );
    expect(component.profile?.firstName).toBe('Taylor');
    expect(component.isEditing).toBeFalse();
  });
});
