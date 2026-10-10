export interface ParentDto {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  parentStatus?: number;
  address?: AddressDto;
  children?: ChildDto[];
}

export type ParentProfileDto = Omit<ParentDto, 'password'>;

export interface AddressDto {
  apartment?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface ChildDto {
  id?: number;
  firstName: string;
  lastName: string;
  dob: string;
  sex: string;
}
