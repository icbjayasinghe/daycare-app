export class FeePlanDto {
  id?: number;
  daycareId?: number;
  name?: string;
  description?: string;
  monthlyFee?: number;
  effectiveFrom?: string;
  effectiveTo?: string | null;
  active = true;
  createdAt?: string;
  updatedAt?: string;
}
