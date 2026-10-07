import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaycareLayoutComponent } from './daycare-layout.component';

describe('DaycareLayoutComponent', () => {
  let component: DaycareLayoutComponent;
  let fixture: ComponentFixture<DaycareLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaycareLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DaycareLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
