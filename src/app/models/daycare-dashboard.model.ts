import { DayCareApplicationDto } from './daycare-application.model';

export type ApplicationSummaryDto = Record<string, number>;

export interface DaycareDashboardDto {
  daycareId?: number;
  totalCapacity?: number;
  enrolledChildren?: number;
  availableSpaces?: number;
  occupancyRate?: number;
  applications?: ApplicationSummaryDto;
  recentApplications?: DayCareApplicationDto[] | null;
}