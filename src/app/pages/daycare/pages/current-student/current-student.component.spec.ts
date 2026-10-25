import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentStudentComponent } from './current-student.component';

describe('CurrentStudentComponent', () => {
  let component: CurrentStudentComponent;
  let fixture: ComponentFixture<CurrentStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrentStudentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrentStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
