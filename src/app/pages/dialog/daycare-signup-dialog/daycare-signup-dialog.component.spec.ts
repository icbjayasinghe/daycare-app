import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/material.module';

import { DaycareSignupDialogComponent } from './daycare-signup-dialog.component';

describe('DaycareSignupDialogComponent', () => {
  let component: DaycareSignupDialogComponent;
  let fixture: ComponentFixture<DaycareSignupDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DaycareSignupDialogComponent],
      imports: [ReactiveFormsModule, MaterialModule],
    }).compileComponents();

    fixture = TestBed.createComponent(DaycareSignupDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
