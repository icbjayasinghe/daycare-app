import { DaycareDto, DaycareProfile } from './daycare.model';
import { ChildDto } from './parent.model';

export enum ApplicationStatus {
  PENDING = 'PENDING',
  WAITLISTED = 'WAITLISTED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN',
  ENROLLED = 'ENROLLED',
}

export interface DayCareApplicationDto {
  id?: number;
  child: ChildDto;
  dayCare: DaycareDto | DaycareProfile;
  status: ApplicationStatus;
  appliedAt?: string;
}