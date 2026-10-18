import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaycareRegisteredComponent } from './daycare-registered.component';

describe('DaycareRegisteredComponent', () => {
  let component: DaycareRegisteredComponent;
  let fixture: ComponentFixture<DaycareRegisteredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaycareRegisteredComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DaycareRegisteredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
