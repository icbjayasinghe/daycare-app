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

export interface AddressDto {
  apartment?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface ChildDto {
  // add Child fields here
}