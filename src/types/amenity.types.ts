// أنواع البيانات الخاصة بالمرافق (Amenities)

export interface AmenityDto {
  id: string;
  name: string;
  description: string;
}

export interface CreateAmenityCommand {
  name: string;
  description: string;
}

export interface UpdateAmenityCommand {
  amenityId: string;
  name?: string;
  description?: string;
}

export interface DeleteAmenityCommand {
  amenityId: string;
}

export interface AssignAmenityToPropertyCommand {
  propertyId: string;
  amenityId: string;
}

export interface AssignAmenityToPropertyTypeCommand {
  propertyTypeId: string;
  amenityId: string;
  isDefault: boolean;
}

export interface UpdatePropertyAmenityCommand {
  propertyId: string;
  amenityId: string;
  isAvailable: boolean;
  extraCost: MoneyDto;
}

export interface MoneyDto {
  amount: number;
  currency: string;
  formattedAmount?: string;
}

export interface PropertyAmenityDto {
  amenityId: string;
  isAvailable: boolean;
  extraCost?: number;
  description?: string;
}

// نتائج العمليات العامة
export interface ResultDto<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
  errorCode?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}
