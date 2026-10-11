import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { ChildDto } from 'src/app/models/parent.model';
import { ChildService } from 'src/app/services/child.service';
import { MaterialModule } from 'src/app/shared/material.module';

import { ParentChildrenComponent } from './parent-children.component';

describe('ParentChildrenComponent', () => {
  let component: ParentChildrenComponent;
  let fixture: ComponentFixture<ParentChildrenComponent>;
  let childService: jasmine.SpyObj<ChildService>;
  let dialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    localStorage.setItem('userEmail', 'parent@example.com');
    childService = jasmine.createSpyObj<ChildService>('ChildService', [
      'getMyChildren',
    ]);
    childService.getMyChildren.and.returnValue(of([]));
    dialog = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      declarations: [ParentChildrenComponent],
      imports: [
        CommonModule,
        MaterialModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: ChildService, useValue: childService },
        { provide: MatDialog, useValue: dialog },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ParentChildrenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => localStorage.removeItem('userEmail'));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads children and displays their details in clickable tiles', () => {
    const child: ChildDto = {
      id: 12,
      firstName: 'Alex',
      lastName: 'Smith',
      dob: '2020-01-01',
      sex: 'NOT_SPECIFIED',
    };
    childService.getMyChildren.and.returnValue(of([child]));

    component.loadChildren();
    fixture.detectChanges();

    const tile = fixture.nativeElement.querySelector(
      '.child-tile',
    ) as HTMLButtonElement;
    expect(childService.getMyChildren).toHaveBeenCalledWith(
      'parent@example.com',
    );
    expect(tile).toBeTruthy();
    expect(tile.textContent).toContain('Alex Smith');
    expect(tile.textContent).toContain('Jan 1, 2020');
    expect(tile.textContent).toContain('NOT_SPECIFIED');
  });

  it('toggles the selected child when its tile is clicked', () => {
    const child: ChildDto = {
      firstName: 'Alex',
      lastName: 'Smith',
      dob: '2020-01-01',
      sex: 'NOT_SPECIFIED',
    };
    component.children = [child];
    fixture.detectChanges();

    const tile = fixture.nativeElement.querySelector(
      '.child-tile',
    ) as HTMLButtonElement;
    tile.click();
    fixture.detectChanges();
    expect(tile.getAttribute('aria-pressed')).toBe('true');

    tile.click();
    fixture.detectChanges();
    expect(tile.getAttribute('aria-pressed')).toBe('false');
  });

  it('shows an error when children cannot be loaded', () => {
    childService.getMyChildren.and.returnValue(
      throwError(() => new Error('Request failed')),
    );

    component.loadChildren();
    fixture.detectChanges();

    expect(component.errorMessage).toBe(
      'Unable to load children. Please try again.',
    );
  });
});
