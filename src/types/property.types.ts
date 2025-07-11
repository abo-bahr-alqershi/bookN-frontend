// أنواع بيانات العقارات (Properties)

export interface PropertyDto {
  id: string;
  ownerId: string;
  typeId: string;
  name: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  starRating: number;
  description: string;
  isApproved: boolean;
  createdAt: string; // ISO date
  ownerName: string;
  typeName: string;
  distanceKm?: number;
}

export interface CreatePropertyCommand {
  name: string;
  address: string;
  propertyTypeId: string;
  ownerId: string;
  description: string;
  latitude: number;
  longitude: number;
  city: string;
  starRating: number;
}

export interface UpdatePropertyCommand {
  propertyId: string;
  name?: string;
  address?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  city?: string;
  starRating?: number;
}

export interface DeletePropertyCommand {
  propertyId: string;
}

export interface GetAllPropertiesQuery {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  propertyTypeId?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  isAscending?: boolean;
  amenityIds?: string[];
  starRatings?: number[];
  minAverageRating?: number;
  isApproved?: boolean;
  hasActiveBookings?: boolean;
}
