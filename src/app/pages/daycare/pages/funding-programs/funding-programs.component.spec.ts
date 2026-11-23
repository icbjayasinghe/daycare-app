import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';

import { FundingProgramsComponent } from './funding-programs.component';
import { FundingProgramsService } from 'src/app/services/funding-programs.service';

describe('FundingProgramsComponent', () => {
  let component: FundingProgramsComponent;
  let fixture: ComponentFixture<FundingProgramsComponent>;
  let fundingProgramsService: jasmine.SpyObj<FundingProgramsService>;

  beforeEach(async () => {
    fundingProgramsService = jasmine.createSpyObj('FundingProgramsService', [
      'getFundingPrograms',
    ]);
    fundingProgramsService.getFundingPrograms.and.returnValue(
      of([
        {
          id: 1,
          name: 'Child Care Subsidy',
          code: 'CHILD_CARE_SUBSIDY',
          fundingType: 'SUBSIDY',
          active: true,
        },
      ]),
    );

    await TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [FundingProgramsComponent],
      providers: [
        { provide: FundingProgramsService, useValue: fundingProgramsService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FundingProgramsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads and displays all funding programs', () => {
    expect(fundingProgramsService.getFundingPrograms).toHaveBeenCalledWith();
    expect(fixture.nativeElement.textContent).toContain('Child Care Subsidy');
    expect(fixture.nativeElement.textContent).toContain('CHILD_CARE_SUBSIDY');
  });
});
