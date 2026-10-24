import { DaycareDto } from './daycare.model';
import { ChildDto } from './parent.model';

export enum EnrollmentStatus {
  ACTIVE = 'ACTIVE',
  ON_HOLD = 'ON_HOLD',
  WITHDRAWN = 'WITHDRAWN',
  COMPLETED = 'COMPLETED',
}

export class DayCareEnrollmentDto {
  id?: number;
  child?: ChildDto;
  daycare?: DaycareDto;
  status!: EnrollmentStatus;
  enrollmentDate?: string;
  endDate?: string | null;
  schedule?: string;
}