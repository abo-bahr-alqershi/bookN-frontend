import axios from 'axios';
import type { PaginatedResult } from '../types/amenity.types';
import type { PropertyDto, SearchPropertiesQuery } from '../types/property.types';

// المسار الأساسي لتعاملات العقارات المشتركة
const API_BASE = '/api/common/properties';

export const CommonPropertiesService = {
  // البحث في العقارات مع الفلاتر، الموقع، والمسافة
  search: (query: SearchPropertiesQuery) =>
    axios.get<PaginatedResult<PropertyDto>>(`${API_BASE}/search`, { params: query }).then(res => res.data),
};