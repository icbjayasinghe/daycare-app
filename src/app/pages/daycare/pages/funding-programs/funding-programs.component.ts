import { Component, OnInit } from '@angular/core';
import { FundingProgramDto } from 'src/app/models/funding-programs.model';
import { FundingProgramsService } from 'src/app/services/funding-programs.service';

@Component({
  selector: 'app-funding-programs',
  templateUrl: './funding-programs.component.html',
  styleUrls: ['./funding-programs.component.css']
})
export class FundingProgramsComponent implements OnInit {
  fundingPrograms: FundingProgramDto[] = [];
  loading = false;
  errorMessage = '';

  constructor(private readonly fundingProgramsService: FundingProgramsService) {}

  ngOnInit(): void {
    this.loadFundingPrograms();
  }

  loadFundingPrograms(): void {
    this.loading = true;
    this.errorMessage = '';
    this.fundingProgramsService.getFundingPrograms().subscribe({
      next: (fundingPrograms) => {
        this.fundingPrograms = fundingPrograms;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load funding programs. Please try again.';
        this.loading = false;
      },
    });
  }
}
