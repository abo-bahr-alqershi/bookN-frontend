// إنشاء هوك لإدارة استعلامات وعمليات أنواع العقارات للوحة الإدارة
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminPropertyTypesService } from '../services/admin-property-types.service';
import type {
  PropertyTypeDto,
  CreatePropertyTypeCommand,
  UpdatePropertyTypeCommand,
  GetAllPropertyTypesQuery
} from '../types/property-type.types';
import type { PaginatedResult, ResultDto } from '../types/common.types';

/**
 * هوك لإدارة استعلامات وعمليات أنواع العقارات (CRUD) للوحة الإدارة
 * يعزل التعامل مع react-query والخدمات في مكان واحد
 * @param params معايير استعلام أنواع العقارات (رقم الصفحة، حجم الصفحة)
 * @returns بيانات PaginatedResult لأنواع العقارات، حالات التحميل والأخطاء، ودوال الإنشاء والتحديث والحذف
 */
export const useAdminPropertyTypes = (params: GetAllPropertyTypesQuery) => {
  const queryClient = useQueryClient();
  const queryKey = ['admin-property-types', params] as const;

  // جلب أنواع العقارات
  const { data: propertyTypesData, isLoading, error } = useQuery<PaginatedResult<PropertyTypeDto>, Error>({
    queryKey,
    queryFn: () => AdminPropertyTypesService.getAll(params),
  });

  // إنشاء نوع عقار
  const createPropertyType = useMutation<ResultDto<string>, Error, CreatePropertyTypeCommand>({
    mutationFn: (data) => AdminPropertyTypesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  // تحديث نوع عقار
  const updatePropertyType = useMutation<ResultDto<boolean>, Error, { propertyTypeId: string; data: UpdatePropertyTypeCommand }>({
    mutationFn: ({ propertyTypeId, data }) => AdminPropertyTypesService.update(propertyTypeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  // حذف نوع عقار
  const deletePropertyType = useMutation<ResultDto<boolean>, Error, string>({
    mutationFn: (propertyTypeId) => AdminPropertyTypesService.delete(propertyTypeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return { propertyTypesData, isLoading, error, createPropertyType, updatePropertyType, deletePropertyType };
}; 