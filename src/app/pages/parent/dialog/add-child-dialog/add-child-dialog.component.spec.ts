import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

import { AddChildDialogComponent } from './add-child-dialog.component';
import { ChildService } from 'src/app/services/child.service';
import { MaterialModule } from 'src/app/shared/material.module';

describe('AddChildDialogComponent', () => {
  let component: AddChildDialogComponent;
  let fixture: ComponentFixture<AddChildDialogComponent>;
  let childService: jasmine.SpyObj<ChildService>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<AddChildDialogComponent>>;

  beforeEach(async () => {
    localStorage.setItem('userEmail', 'parent@example.com');
    childService = jasmine.createSpyObj<ChildService>('ChildService', ['registerChild']);
    dialogRef = jasmine.createSpyObj<MatDialogRef<AddChildDialogComponent>>(
      'MatDialogRef',
      ['close'],
    );

    await TestBed.configureTestingModule({
      declarations: [AddChildDialogComponent],
      imports: [
        CommonModule,
        ReactiveFormsModule,
        MaterialModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: ChildService, useValue: childService },
        { provide: MatDialogRef, useValue: dialogRef },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddChildDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => localStorage.removeItem('userEmail'));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('registers the child and closes the dialog on success', () => {
    const child = {
      firstName: 'Alex',
      lastName: 'Smith',
      dob: '2020-01-01',
      sex: 'NOT_SPECIFIED',
    };
    childService.registerChild.and.returnValue(of(child));
    component.childForm.setValue(child);

    component.onSubmit();

    expect(childService.registerChild).toHaveBeenCalledWith(
      'parent@example.com',
      child,
    );
    expect(dialogRef.close).toHaveBeenCalledWith(child);
  });

  it('keeps the dialog open and shows an error when registration fails', () => {
    childService.registerChild.and.returnValue(
      throwError(() => new Error('Request failed')),
    );
    component.childForm.setValue({
      firstName: 'Alex',
      lastName: 'Smith',
      dob: '2020-01-01',
      sex: 'NOT_SPECIFIED',
    });

    component.onSubmit();

    expect(dialogRef.close).not.toHaveBeenCalled();
    expect(component.errorMessage).toBe('Unable to add child. Please try again.');
  });
});
