import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoInvoiceComponent } from './auto-invoice.component';

describe('AutoInvoiceComponent', () => {
  let component: AutoInvoiceComponent;
  let fixture: ComponentFixture<AutoInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutoInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutoInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
