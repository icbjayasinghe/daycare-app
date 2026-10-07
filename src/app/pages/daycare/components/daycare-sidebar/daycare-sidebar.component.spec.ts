import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaycareSidebarComponent } from './daycare-sidebar.component';

describe('DaycareSidebarComponent', () => {
  let component: DaycareSidebarComponent;
  let fixture: ComponentFixture<DaycareSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaycareSidebarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DaycareSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
