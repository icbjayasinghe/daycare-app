import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { FeePlanDto } from 'src/app/models/fee-plan.model';
import { DaycareService } from 'src/app/services/daycare.service';
import { PaymentService } from 'src/app/services/payment.service';
import { AddFeePlanComponent } from '../../dialog/add-fee-plan/add-fee-plan.component';

import { FeePlanComponent } from './fee-plan.component';

describe('FeePlanComponent', () => {
  let component: FeePlanComponent;
  let fixture: ComponentFixture<FeePlanComponent>;
  let dialog: jasmine.SpyObj<MatDialog>;
  let daycareService: jasmine.SpyObj<DaycareService>;
  let paymentService: jasmine.SpyObj<PaymentService>;
  const feePlans: FeePlanDto[] = [
    {
      id: 1,
      daycareId: 42,
      name: 'Full-time care',
      description: 'Weekday care',
      monthlyFee: 900,
      effectiveFrom: '2026-01-01',
      active: true,
    },
  ];

  beforeEach(async () => {
    dialog = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);
    daycareService = jasmine.createSpyObj<DaycareService>('DaycareService', [
      'getMyDaycare',
    ]);
    paymentService = jasmine.createSpyObj<PaymentService>('PaymentService', [
      'getMyFeePlans',
    ]);
    localStorage.setItem('userEmail', 'provider@example.com');
    daycareService.getMyDaycare.and.returnValue(
      of({
        id: 42,
        name: 'Test daycare',
        telephone: '555-0100',
        owners: [],
        address: {
          apartment: '',
          address: '',
          city: '',
          state: '',
          postalCode: '',
          country: '',
        },
      }),
    );
    paymentService.getMyFeePlans.and.returnValue(of(feePlans));

    await TestBed.configureTestingModule({
      declarations: [FeePlanComponent],
      providers: [
        { provide: MatDialog, useValue: dialog },
        { provide: DaycareService, useValue: daycareService },
        { provide: PaymentService, useValue: paymentService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FeePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.removeItem('userEmail');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads active fee plans for the signed-in daycare', () => {
    expect(daycareService.getMyDaycare).toHaveBeenCalledWith(
      'provider@example.com',
    );
    expect(paymentService.getMyFeePlans).toHaveBeenCalledWith(42, true);
    expect(fixture.nativeElement.textContent).toContain('Full-time care');
    expect(fixture.nativeElement.textContent).toContain('$900.00');
  });

  it('opens the add fee plan dialog from the plus button', () => {
    dialog.open.and.returnValue({
      afterClosed: () => of(undefined),
    } as MatDialogRef<AddFeePlanComponent>);
    fixture.nativeElement.querySelector('button').click();

    expect(dialog.open).toHaveBeenCalled();
  });
});
