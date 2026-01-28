import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ParentSignupDialogComponent } from './parent-signup-dialog.component';

describe('ParentSignupDialogComponent', () => {
  let component: ParentSignupDialogComponent;
  let fixture: ComponentFixture<ParentSignupDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParentSignupDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParentSignupDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
