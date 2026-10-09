export interface DaycareDto {
  name: string;
  telephone: string;
  owners: DaycareOwner[];
  address: DaycareAddress;
}

export interface DaycareProfile {
  id?: number | string;
  name: string;
  telephone: string;
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
}
