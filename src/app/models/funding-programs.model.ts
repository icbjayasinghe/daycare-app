export interface FundingProgramDto {
  id?: number;
  name: string;
  code: string;
  description?: string;
  fundingType: string;
  active: boolean;
}