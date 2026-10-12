import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyChildDialogComponent } from './apply-child-dialog.component';

describe('ApplyChildDialogComponent', () => {
  let component: ApplyChildDialogComponent;
  let fixture: ComponentFixture<ApplyChildDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplyChildDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplyChildDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
