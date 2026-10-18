import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaycareRequestsComponent } from './daycare-requests.component';

describe('DaycareRequestsComponent', () => {
  let component: DaycareRequestsComponent;
  let fixture: ComponentFixture<DaycareRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaycareRequestsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DaycareRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
