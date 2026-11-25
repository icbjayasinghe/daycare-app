import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ManualInvoiceComponent } from './manual-invoice.component';

describe('ManualInvoiceComponent', () => {
  let component: ManualInvoiceComponent;
  let fixture: ComponentFixture<ManualInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule],
      declarations: [ManualInvoiceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ManualInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('updates the invoice preview total from charges', () => {
    component.charges = [
      { description: 'Late pickup', amount: 12.5 },
      { description: 'Registration', amount: 25 },
    ];
    fixture.detectChanges();

    expect(component.invoiceTotal).toBe(37.5);
    expect(fixture.nativeElement.textContent).toContain('$37.50');
  });

  it('requires child and parent names before downloading', () => {
    component.childName = 'Alex Child';
    component.downloadPdf();

    expect(component.validationMessage).toContain('child and parent names');
  });

  it('requires each charge to have a description and positive amount', () => {
    component.childName = 'Alex Child';
    component.parentName = 'Jordan Parent';
    component.invoiceNumber = 'INV-1001';
    component.invoiceDate = '2026-11-25';
    component.billingPeriodStart = '2026-11-01';
    component.billingPeriodEnd = '2026-11-30';
    component.charges = [{ description: 'Late pickup', amount: null }];

    component.downloadPdf();

    expect(component.validationMessage).toContain(
      'description and a positive amount',
    );
  });

  it('requires a valid billing period before downloading', () => {
    component.childName = 'Alex Child';
    component.parentName = 'Jordan Parent';
    component.invoiceNumber = 'INV-1001';
    component.invoiceDate = '2026-11-25';
    component.billingPeriodStart = '2026-11-30';
    component.billingPeriodEnd = '2026-11-01';
    component.charges = [{ description: 'Late pickup', amount: 12.5 }];

    component.downloadPdf();

    expect(component.validationMessage).toContain(
      'end date must be on or after the start date',
    );
  });
});
