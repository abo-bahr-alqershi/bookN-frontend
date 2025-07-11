import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AmenitiesService } from '../services/amenities.service';
import type {
  AmenityDto,
  CreateAmenityCommand,
  UpdateAmenityCommand,
  AssignAmenityToPropertyCommand,
  AssignAmenityToPropertyTypeCommand,
  UpdatePropertyAmenityCommand,
  PaginatedResult,
  ResultDto,
} from '../types/amenity.types';

// جلب جميع المرافق مع صفحات
export function useGetAllAmenities(params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }) {
  return useQuery({
    queryKey: ['amenities', params],
    queryFn: () => AmenitiesService.getAllAmenities(params).then(res => res.data),
  });
}

// إضافة مرفق جديد
export function useCreateAmenity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAmenityCommand) => AmenitiesService.createAmenity(data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['amenities'] });
    },
  });
}

// تحديث مرفق
export function useUpdateAmenity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ amenityId, data }: { amenityId: string; data: UpdateAmenityCommand }) =>
      AmenitiesService.updateAmenity(amenityId, data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['amenities'] });
    },
  });
}

// حذف مرفق
export function useDeleteAmenity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (amenityId: string) => AmenitiesService.deleteAmenity(amenityId).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['amenities'] });
    },
  });
}
