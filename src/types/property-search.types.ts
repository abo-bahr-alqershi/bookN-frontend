export interface PriceRangeDto {
  minPrice: number;
  maxPrice: number;
  averagePrice: number;
}

export interface PropertySearchItemDto {
  id: string;
  name: string;
  description?: string;
  city: string;
  address: string;
  starRating: number;
  averageRating?: number;
  reviewCount: number;
  minPrice: number;
  currency: string;
  mainImageUrl?: string;
  imageUrls: string[];
  amenities: string[];
  propertyType: string;
  distanceKm?: number;
  isAvailable: boolean;
  availableUnitsCount: number;
  dynamicFields: Record<string, any>;
  maxCapacity: number;
  isFeatured: boolean;
  lastUpdated: string;
}

export interface PropertySearchResultDto {
  properties: PropertySearchItemDto[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  statistics?: SearchStatisticsDto;
}

export interface SearchFilterCriteriaDto {
  fieldId: string;
  filterId: string;
  filterType: string;
  filterValue: any;
  filterOptions?: Record<string, any>;
}

export interface SearchStatisticsDto {
  searchDurationMs: number;
  appliedFiltersCount: number;
  totalResultsBeforePaging: number;
  suggestions: string[];
  priceRange?: PriceRangeDto;
}