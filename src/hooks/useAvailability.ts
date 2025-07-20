import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AvailabilityAndPricingService } from '../services/availability.services';
import type {
  UnitManagementData,
  ManagementPageResponse,
  CreateAvailabilityRequest,
  UpdateAvailabilityRequest,
  AvailabilitySearchRequest,
  AvailabilitySearchResponse,
  ConflictCheckRequest,
  ConflictCheckResponse,
  AvailabilityStatistics,
  AvailabilityError,
  AvailabilityStatus
} from '../types/availability_types';

// ===== هوك إدارة الإتاحة الرئيسي =====
// إضافة وسيط unitId لجلب بيانات وحدة مفردة
export function useAvailability(propertyId?: string, unitId?: string) {
  const queryClient = useQueryClient();
  const [error, setError] = useState<AvailabilityError | null>(null);

  // استعلام بيانات property-level
  const propertyQuery = useQuery<ManagementPageResponse, Error>({
    queryKey: ['availability-management', propertyId],
    queryFn: () => AvailabilityAndPricingService.management.getManagementPageData(propertyId),
    enabled: !unitId,
    retry: 2,
    staleTime: 5 * 60 * 1000,
  });
  // استعلام بيانات unit-level
  const unitQuery = useQuery<UnitManagementData, Error>({
    queryKey: ['unit-management', unitId],
    queryFn: () => AvailabilityAndPricingService.management.getUnitManagementData(unitId!),
    enabled: !!unitId,
    retry: 2,
    staleTime: 5 * 60 * 1000,
  });

  // دمج النتائج في نموذج موحد
  const units: UnitManagementData[] = unitId
    ? (unitQuery.data ? [unitQuery.data] : [])
    : (propertyQuery.data?.units || []);
  const statistics = unitId
    ? null
    : (propertyQuery.data?.summary || null);
  const loading = unitId ? unitQuery.isLoading : propertyQuery.isLoading;
  const queryError = unitId ? unitQuery.error : propertyQuery.error;

  // إنشاء إتاحة جديدة
  const createAvailabilityMutation = useMutation({
    // إنشاء إتاحة: تستخدم service مباشرة
    mutationFn: (request: CreateAvailabilityRequest) => AvailabilityAndPricingService.availability.createAvailability(request),
    onSuccess: () => {
      // إعادة جلب البيانات بعد التغيير
      if (unitId) queryClient.invalidateQueries({ queryKey: ['unit-management', unitId] });
      else queryClient.invalidateQueries({ queryKey: ['availability-management', propertyId] });
      setError(null);
    },
    onError: (err: any) => {
      setError(err);
    }
  });

  // تعديل إتاحة
  const updateAvailabilityMutation = useMutation({
    mutationFn: (request: UpdateAvailabilityRequest) => AvailabilityAndPricingService.availability.updateAvailability(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: unitId ? ['unit-management', unitId] : ['availability-management', propertyId] });
      setError(null);
    },
    onError: (err: any) => {
      setError(err);
    }
  });

  // حذف إتاحة
  const deleteAvailabilityMutation = useMutation({
    mutationFn: (availabilityId: string) => AvailabilityAndPricingService.availability.deleteAvailability(availabilityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: unitId ? ['unit-management', unitId] : ['availability-management', propertyId] });
      setError(null);
    },
    onError: (err: any) => {
      setError(err);
    }
  });

  // البحث في الإتاحة
  const searchAvailabilityMutation = useMutation({
    mutationFn: (request: AvailabilitySearchRequest) => AvailabilityAndPricingService.availability.searchAvailability(request),
    onError: (err: any) => {
      setError(err);
    }
  });

  // التحقق من التعارضات
  const checkConflictsMutation = useMutation({
    mutationFn: (request: ConflictCheckRequest) => AvailabilityAndPricingService.validation.checkConflicts(request),
    onError: (err: any) => {
      setError(err);
    }
  });

  // تحديث سريع للحالة
  const quickUpdateStatusMutation = useMutation({
    mutationFn: ({ unitId, status, dateRange }: { unitId: string; status: AvailabilityStatus; dateRange: { start: string; end: string } }) => AvailabilityAndPricingService.availability.quickUpdateStatus(unitId, status, dateRange),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: unitId ? ['unit-management', unitId] : ['availability-management', propertyId] });
      setError(null);
    },
    onError: (err: any) => {
      setError(err);
    }
  });

  // إنشاء مجمع
  const bulkCreateAvailabilityMutation = useMutation({
    mutationFn: (requests: CreateAvailabilityRequest[]) => AvailabilityAndPricingService.availability.bulkCreateAvailability(requests),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: unitId ? ['unit-management', unitId] : ['availability-management', propertyId] });
      setError(null);
    },
    onError: (err: any) => {
      setError(err);
    }
  });

  // استيراد بيانات الصادر
  const exportDataMutation = useMutation({
    mutationFn: ({ format, data }: { format: 'excel' | 'csv' | 'pdf'; data: any }) => AvailabilityAndPricingService.management.exportData(format, data),
    onError: (err: any) => {
      setError(err);
    }
  });

  // دوال مساعدة
  const loadUnits = useCallback(() => {
    setError(null);
    return propertyQuery.refetch(); // Refetch property data
  }, [propertyQuery.refetch]);

  const createAvailability = useCallback(async (request: CreateAvailabilityRequest) => {
    return createAvailabilityMutation.mutateAsync(request);
  }, [createAvailabilityMutation]);

  const updateAvailability = useCallback(async (request: UpdateAvailabilityRequest) => {
    return updateAvailabilityMutation.mutateAsync(request);
  }, [updateAvailabilityMutation]);

  const deleteAvailability = useCallback(async (availabilityId: string) => {
    return deleteAvailabilityMutation.mutateAsync(availabilityId);
  }, [deleteAvailabilityMutation]);

  const searchAvailability = useCallback(async (request: AvailabilitySearchRequest) => {
    return searchAvailabilityMutation.mutateAsync(request);
  }, [searchAvailabilityMutation]);

  const checkConflicts = useCallback(async (request: ConflictCheckRequest) => {
    return checkConflictsMutation.mutateAsync(request);
  }, [checkConflictsMutation]);

  const quickUpdateStatus = useCallback(async (
    unitId: string, 
    status: AvailabilityStatus, 
    dateRange: { start: string; end: string }
  ) => {
    return quickUpdateStatusMutation.mutateAsync({ unitId, status, dateRange });
  }, [quickUpdateStatusMutation]);

  const bulkCreateAvailability = useCallback(async (requests: CreateAvailabilityRequest[]) => {
    return bulkCreateAvailabilityMutation.mutateAsync(requests);
  }, [bulkCreateAvailabilityMutation]);

  const exportData = useCallback(async (format: 'excel' | 'csv' | 'pdf', data: any) => {
    const blob = await exportDataMutation.mutateAsync({ format, data });
    
    // تحميل الملف
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `availability-data.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }, [exportDataMutation]);

  // معالجة الأخطاء من React Query
  useEffect(() => {
    if (queryError) {
      setError(queryError as unknown as AvailabilityError);
    }
  }, [queryError]);

  return {
    // البيانات
    units,
    statistics,
    loading,
    error,
    
    // الوظائف
    loadUnits,
    createAvailability,
    updateAvailability,
    deleteAvailability,
    searchAvailability,
    checkConflicts,
    quickUpdateStatus,
    bulkCreateAvailability,
    exportData,
    
    // حالات التحميل
    isCreating: createAvailabilityMutation.isPending,
    isUpdating: updateAvailabilityMutation.isPending,
    isDeleting: deleteAvailabilityMutation.isPending,
    isSearching: searchAvailabilityMutation.isPending,
    isCheckingConflicts: checkConflictsMutation.isPending,
    isExporting: exportDataMutation.isPending,
    
    // تنظيف الأخطاء
    clearError: () => setError(null)
  };
}

// ===== هوك التحقق من التعارضات =====
export function useBookingConflicts() {
  const [conflicts, setConflicts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkConflicts = useCallback(async (request: ConflictCheckRequest) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await AvailabilityAndPricingService.validation.checkConflicts(request);
      setConflicts(response.conflicts || []);
      
      return response;
    } catch (err: any) {
      setError(err.message || 'خطأ في التحقق من التعارضات');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const resolveConflict = useCallback(async (conflictId: string, action: string, notes?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await AvailabilityAndPricingService.conflicts.applyResolution(conflictId, {
        action,
        notes
      });
      
      // إزالة التعارض المحلول من القائمة
      setConflicts(prev => prev.filter(c => c.conflict_id !== conflictId));
      
      return response;
    } catch (err: any) {
      setError(err.message || 'خطأ في حل التعارض');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getResolutionOptions = useCallback(async (conflictId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      return await AvailabilityAndPricingService.conflicts.getResolutionOptions(conflictId);
    } catch (err: any) {
      setError(err.message || 'خطأ في الحصول على خيارات الحل');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    conflicts,
    loading,
    error,
    checkConflicts,
    resolveConflict,
    getResolutionOptions,
    clearConflicts: () => setConflicts([]),
    clearError: () => setError(null)
  };
}

// ===== هوك اختيار نطاق التواريخ =====
export function useDateRange(initialStart?: Date, initialEnd?: Date) {
  const [startDate, setStartDate] = useState<Date | null>(initialStart || null);
  const [endDate, setEndDate] = useState<Date | null>(initialEnd || null);
  const [isSelecting, setIsSelecting] = useState(false);

  const setDateRange = useCallback((start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
  }, []);

  const clearDateRange = useCallback(() => {
    setStartDate(null);
    setEndDate(null);
    setIsSelecting(false);
  }, []);

  const startSelection = useCallback(() => {
    setIsSelecting(true);
    setStartDate(null);
    setEndDate(null);
  }, []);

  const finishSelection = useCallback(() => {
    setIsSelecting(false);
  }, []);

  // حساب عدد الأيام
  const dayCount = startDate && endDate 
    ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
    : 0;

  // التحقق من صحة النطاق
  const isValidRange = startDate && endDate && startDate <= endDate;

  // تنسيق النطاق للعرض
  const formatRange = useCallback((locale: string = 'ar-SA') => {
    if (!startDate || !endDate) return '';
    
    const formatter = new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    return `${formatter.format(startDate)} - ${formatter.format(endDate)}`;
  }, [startDate, endDate]);

  return {
    startDate,
    endDate,
    isSelecting,
    dayCount,
    isValidRange,
    setStartDate,
    setEndDate,
    setDateRange,
    clearDateRange,
    startSelection,
    finishSelection,
    formatRange
  };
}

// ===== هوك التحقق من صحة البيانات =====
export function useValidation() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValid, setIsValid] = useState(true);

  const validateAvailabilityRequest = useCallback((request: CreateAvailabilityRequest) => {
    const newErrors: Record<string, string> = {};

    // التحقق من الحقول المطلوبة
    if (!request.unitId) {
      newErrors.unitId = 'معرف الوحدة مطلوب';
    }

    if (!request.startDate) {
      newErrors.startDate = 'تاريخ البداية مطلوب';
    }

    if (!request.endDate) {
      newErrors.endDate = 'تاريخ النهاية مطلوب';
    }

    if (!request.status) {
      newErrors.status = 'حالة الإتاحة مطلوبة';
    }

    // التحقق من منطقية التواريخ
    if (request.startDate && request.endDate) {
      const start = new Date(request.startDate);
      const end = new Date(request.endDate);
      
      if (start > end) {
        newErrors.date_range = 'تاريخ البداية يجب أن يكون قبل تاريخ النهاية';
      }

      // التحقق من عدم كون التاريخ في الماضي (إلا إذا كان مسموحاً)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (start < today) {
        newErrors.startDate = 'لا يمكن تحديد تاريخ في الماضي';
      }
    }

    // التحقق من الأوقات
    if (request.startTime && request.endTime) {
      const startTime = request.startTime.split(':').map(Number);
      const endTime = request.endTime.split(':').map(Number);
      
      const startMinutes = startTime[0] * 60 + startTime[1];
      const endMinutes = endTime[0] * 60 + endTime[1];
      
      if (startMinutes >= endMinutes) {
        newErrors.time_range = 'وقت البداية يجب أن يكون قبل وقت النهاية';
      }
    }

    // التحقق من سبب عدم الإتاحة
    if (request.status === 'unavailable' && !request.reason) {
      newErrors.reason = 'سبب عدم الإتاحة مطلوب';
    }

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);

    return Object.keys(newErrors).length === 0;
  }, []);

  const validateDateRange = useCallback((start: Date | null, end: Date | null) => {
    const newErrors: Record<string, string> = {};

    if (!start) {
      newErrors.startDate = 'تاريخ البداية مطلوب';
    }

    if (!end) {
      newErrors.endDate = 'تاريخ النهاية مطلوب';
    }

    if (start && end && start > end) {
      newErrors.date_range = 'تاريخ البداية يجب أن يكون قبل تاريخ النهاية';
    }

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);

    return Object.keys(newErrors).length === 0;
  }, []);

  const getFieldError = useCallback((field: string) => {
    return errors[field] || null;
  }, [errors]);

  const clearErrors = useCallback(() => {
    setErrors({});
    setIsValid(true);
  }, []);

  const clearFieldError = useCallback((field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
    
    setIsValid(Object.keys(errors).length <= 1);
  }, [errors]);

  return {
    errors,
    isValid,
    validateAvailabilityRequest,
    validateDateRange,
    getFieldError,
    clearErrors,
    clearFieldError
  };
}

// ===== هوك الإحصائيات =====
export function useAvailabilityStatistics(unitIds?: string[], dateRange?: { start: string; end: string }) {
  const [statistics, setStatistics] = useState<AvailabilityStatistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStatistics = useCallback(async () => {
    if (!unitIds || unitIds.length === 0 || !dateRange) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const stats = await AvailabilityAndPricingService.management.getAvailabilityStatistics(
        unitIds,
        dateRange
      );
      
      setStatistics(stats);
    } catch (err: any) {
      setError(err.message || 'خطأ في تحميل الإحصائيات');
    } finally {
      setLoading(false);
    }
  }, [unitIds, dateRange]);

  // تحميل الإحصائيات عند تغيير المعاملات
  useEffect(() => {
    loadStatistics();
  }, [loadStatistics]);

  return {
    statistics,
    loading,
    error,
    refresh: loadStatistics,
    clearError: () => setError(null)
  };
}