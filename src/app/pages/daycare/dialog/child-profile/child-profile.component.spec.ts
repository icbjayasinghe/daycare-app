import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { ChildDto, ParentDto } from 'src/app/models/parent.model';
import { ParentService } from 'src/app/services/parent.service';
import { MaterialModule } from 'src/app/shared/material.module';
import { ChildProfileComponent } from './child-profile.component';

describe('ChildProfileComponent', () => {
  let component: ChildProfileComponent;
  let fixture: ComponentFixture<ChildProfileComponent>;
  let parentService: jasmine.SpyObj<ParentService>;
  const child: ChildDto = {
    id: 4,
    firstName: 'Sam',
    lastName: 'Jones',
    dob: '2021-03-15',
    sex: 'FEMALE',
  };
  const parent: ParentDto = {
    id: 9,
    firstName: 'Taylor',
    lastName: 'Jones',
    email: 'taylor@example.com',
    password: 'not-rendered',
    phone: '555-0100',
    address: {
      apartment: '2B',
      address: '20 Oak Road',
      city: 'Springfield',
      state: 'CA',
      postalCode: '90000',
      country: 'USA',
    },
  };

  beforeEach(async () => {
    parentService = jasmine.createSpyObj<ParentService>(
      'ParentService',
      ['getParentByChild'],
    );
    parentService.getParentByChild.and.returnValue(of(parent));

    await TestBed.configureTestingModule({
      declarations: [ChildProfileComponent],
      imports: [CommonModule, MaterialModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: child },
        { provide: ParentService, useValue: parentService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChildProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads and displays parent profile and address details', () => {
    expect(parentService.getParentByChild).toHaveBeenCalledWith(4);
    const content = fixture.nativeElement.textContent;
    expect(content).toContain('Sam Jones');
    expect(content).toContain('Taylor Jones');
    expect(content).toContain('taylor@example.com');
    expect(content).toContain('20 Oak Road');
    expect(content).toContain('Springfield');
    expect(content).not.toContain('not-rendered');
  });

  it('shows an error if parent details fail to load', () => {
    parentService.getParentByChild.and.returnValue(
      throwError(() => new Error('Request failed')),
    );
    component.parent = null;

    component.ngOnInit();

    expect(component.loadingParent).toBeFalse();
    expect(component.parentError).toBe('Unable to load parent details.');
  });
});
