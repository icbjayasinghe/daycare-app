export enum DaycareStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  DEACTIVATED = 'DEACTIVATED',
}

export interface DaycareDto {
  id: number;
  name: string;
  telephone: string;
  website?: string;
  withOwnPortal?: boolean;
  owners: DaycareOwner[];
  address: DaycareAddress;
  status: DaycareStatus;
}

export interface DaycareProfile {
  id?: number | string;
  name: string;
  telephone: string;
  website?: string;
  withOwnPortal?: boolean;
  owners: DaycareProfileOwner[];
  address: DaycareAddress;
}

export interface DaycareProfileOwner {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  userType?: number;
}

export interface DaycareOwner {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  userType: number;
}

export interface DaycareAddress {
  apartment: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
}
