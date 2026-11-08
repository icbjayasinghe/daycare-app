import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';

import { FeePlanComponent } from './fee-plan.component';

describe('FeePlanComponent', () => {
  let component: FeePlanComponent;
  let fixture: ComponentFixture<FeePlanComponent>;
  let dialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    dialog = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);
    await TestBed.configureTestingModule({
      declarations: [FeePlanComponent],
      providers: [{ provide: MatDialog, useValue: dialog }],
    }).compileComponents();

    fixture = TestBed.createComponent(FeePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('opens the add fee plan dialog from the plus button', () => {
    fixture.nativeElement.querySelector('button').click();

    expect(dialog.open).toHaveBeenCalled();
  });
});
