import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentDaycaresComponent } from './parent-daycares.component';

describe('ParentDaycaresComponent', () => {
  let component: ParentDaycaresComponent;
  let fixture: ComponentFixture<ParentDaycaresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParentDaycaresComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParentDaycaresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
