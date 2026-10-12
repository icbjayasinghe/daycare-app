import { DaycareDto, DaycareProfile } from './daycare.model';
import { ChildDto } from './parent.model';

export interface DayCareApplicationDto {
  id?: number;
  child: ChildDto;
  dayCare: DaycareDto | DaycareProfile;
  status: string;
  appliedAt?: string;
}