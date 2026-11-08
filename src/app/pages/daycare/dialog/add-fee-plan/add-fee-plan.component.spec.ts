import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/shared/material.module';
import { DaycareService } from 'src/app/services/daycare.service';
import { PaymentService } from 'src/app/services/payment.service';

import { AddFeePlanComponent } from './add-fee-plan.component';

describe('AddFeePlanComponent', () => {
  let component: AddFeePlanComponent;
  let fixture: ComponentFixture<AddFeePlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddFeePlanComponent],
      imports: [ReactiveFormsModule, MaterialModule],
      providers: [
        { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } },
        { provide: DaycareService, useValue: jasmine.createSpyObj('DaycareService', ['getMyDaycare']) },
        { provide: PaymentService, useValue: jasmine.createSpyObj('PaymentService', ['addFeePlan']) },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddFeePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
