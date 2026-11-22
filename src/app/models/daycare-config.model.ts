export class DaycareConfigDto {
  configId?: number;
  daycareId?: number;
  totalCapacity?: number;
  hourlyCharge?: number;
  paymentsEnabled = false;
}