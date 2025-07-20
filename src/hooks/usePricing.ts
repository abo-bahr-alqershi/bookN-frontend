import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AvailabilityAndPricingService } from '../services/availability.services';
import type {
  UnitManagementData,
  ManagementPageResponse,
  CreatePricingRequest,
  UpdatePricingRequest,
  PricingSearchRequest,
  PricingSearchResponse,
  ConflictCheckRequest,
  ConflictCheckResponse,
  PricingStatistics,
  PricingError,
  PricingTier,
  PriceType
} from '../types/availability_types';

// ===== هوك إدارة التسعير الرئيسي =====
export function usePricing(propertyId?: string) {
  const queryClient = useQueryClient();
  const [error, setError] = useState<PricingError | null>(null);

  // تحميل بيانات الوحدات
  const {
    data: managementData,
    isLoading: loading,
    error: queryError,
    refetch: refetchUnits
  } = useQuery({
    queryKey: ['pricing-management', propertyId],
    queryFn: () => AvailabilityAndPricingService.management.getManagementPageData(propertyId),
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 دقائق
  });

  // استخراج البيانات
  const units: UnitManagementData[] = managementData?.units || [];
  const statistics = managementData?.summary || null;

  // إنشاء قاعدة تسعير جديدة
  const createPricingMutation = useMutation({
    mutationFn: (request: CreatePricingRequest) => 
      AvailabilityAndPricingService.pricing.createPricing(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricing-management'] });
      setError(null);
    },
    onError: (err: any) => {
      setError(err);
    }
  });

  // تحديث قاعدة التسعير
  const updatePricingMutation = useMutation({
    mutationFn: (request: UpdatePricingRequest) => 
      AvailabilityAndPricingService.pricing.updatePricing(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricing-management'] });
      setError(null);
    },
    onError: (err: any) => {
      setError(err);
    }
  });

  // حذف قاعدة التسعير
  const deletePricingMutation = useMutation({
    mutationFn: (pricingId: string) => 
      AvailabilityAndPricingService.pricing.deletePricing(pricingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricing-management'] });
      setError(null);
    },
    onError: (err: any) => {
      setError(err);
    }
  });

  // البحث في قواعد التسعير
  const searchPricingMutation = useMutation({
    mutationFn: (request: PricingSearchRequest) => 
      AvailabilityAndPricingService.pricing.searchPricing(request),
    onError: (err: any) => {
      setError(err);
    }
  });

  // التحقق من التعارضات
  const checkConflictsMutation = useMutation({
    mutationFn: (request: ConflictCheckRequest) => 
      AvailabilityAndPricingService.validation.checkConflicts(request),
    onError: (err: any) => {
      setError(err);
    }
  });

  // تحديث سريع للسعر
  const quickUpdatePriceMutation = useMutation({
    mutationFn: ({ unitId, newPrice, dateRange }: {
      unitId: string;
      newPrice: number;
      dateRange: { start: string; end: string };
    }) => AvailabilityAndPricingService.pricing.quickUpdatePrice(unitId, newPrice, dateRange),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricing-management'] });
      setError(null);
    },
    onError: (err: any) => {
      setError(err);
    }
  });

  // تطبيق نسبة مئوية
  const applyPercentageChangeMutation = useMutation({
    mutationFn: ({ unitIds, percentage, dateRange }: {
      unitIds: string[];
      percentage: number;
      dateRange: { start: string; end: string };
    }) => AvailabilityAndPricingService.pricing.applyPercentageChange(unitIds, percentage, dateRange),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricing-management'] });
      setError(null);
    },
    onError: (err: any) => {
      setError(err);
    }
  });

  // إنشاء قواعد تسعير مجمعة
  const bulkCreatePricingMutation = useMutation({
    mutationFn: (requests: CreatePricingRequest[]) => 
      AvailabilityAndPricingService.pricing.bulkCreatePricing(requests),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricing-management'] });
      setError(null);
    },
    onError: (err: any) => {
      setError(err);
    }
  });

  // الحصول على اقتراحات الأسعار
  const getPricingSuggestionsMutation = useMutation({
    mutationFn: ({ unitId, dateRange }: {
      unitId: string;
      dateRange: { start: string; end: string };
    }) => AvailabilityAndPricingService.pricing.getPricingSuggestions(unitId, dateRange),
    onError: (err: any) => {
      setError(err);
    }
  });

  // تصدير البيانات
  const exportDataMutation = useMutation({
    mutationFn: ({ format, data }: { format: 'excel' | 'csv' | 'pdf'; data: any }) => 
      AvailabilityAndPricingService.management.exportData(format, data),
    onError: (err: any) => {
      setError(err);
    }
  });

  // دوال مساعدة
  const loadUnits = useCallback(() => {
    setError(null);
    return refetchUnits();
  }, [refetchUnits]);

  const createPricing = useCallback(async (request: CreatePricingRequest) => {
    return createPricingMutation.mutateAsync(request);
  }, [createPricingMutation]);

  const updatePricing = useCallback(async (request: UpdatePricingRequest) => {
    return updatePricingMutation.mutateAsync(request);
  }, [updatePricingMutation]);

  const deletePricing = useCallback(async (pricingId: string) => {
    return deletePricingMutation.mutateAsync(pricingId);
  }, [deletePricingMutation]);

  const searchPricing = useCallback(async (request: PricingSearchRequest) => {
    return searchPricingMutation.mutateAsync(request);
  }, [searchPricingMutation]);

  const checkConflicts = useCallback(async (request: ConflictCheckRequest) => {
    return checkConflictsMutation.mutateAsync(request);
  }, [checkConflictsMutation]);

  const quickUpdatePrice = useCallback(async (
    unitId: string, 
    newPrice: number, 
    dateRange: { start: string; end: string }
  ) => {
    return quickUpdatePriceMutation.mutateAsync({ unitId, newPrice, dateRange });
  }, [quickUpdatePriceMutation]);

  const applyBulkPricing = useCallback(async (
    unitIds: string[], 
    percentage: number, 
    dateRange: { start: string; end: string }
  ) => {
    return applyPercentageChangeMutation.mutateAsync({ unitIds, percentage, dateRange });
  }, [applyPercentageChangeMutation]);

  const bulkCreatePricing = useCallback(async (requests: CreatePricingRequest[]) => {
    return bulkCreatePricingMutation.mutateAsync(requests);
  }, [bulkCreatePricingMutation]);

  const getPricingSuggestions = useCallback(async (
    unitId: string, 
    dateRange: { start: string; end: string }
  ) => {
    return getPricingSuggestionsMutation.mutateAsync({ unitId, dateRange });
  }, [getPricingSuggestionsMutation]);

  const exportData = useCallback(async (format: 'excel' | 'csv' | 'pdf', data: any) => {
    const blob = await exportDataMutation.mutateAsync({ format, data });
    
    // تحميل الملف
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pricing-data.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }, [exportDataMutation]);

  // معالجة الأخطاء من React Query
  useEffect(() => {
    if (queryError) {
      setError(queryError as unknown as PricingError);
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
    createPricing,
    updatePricing,
    deletePricing,
    searchPricing,
    checkConflicts,
    quickUpdatePrice,
    applyBulkPricing,
    bulkCreatePricing,
    getPricingSuggestions,
    exportData,
    
    // حالات التحميل
    isCreating: createPricingMutation.isPending,
    isUpdating: updatePricingMutation.isPending,
    isDeleting: deletePricingMutation.isPending,
    isSearching: searchPricingMutation.isPending,
    isCheckingConflicts: checkConflictsMutation.isPending,
    isExporting: exportDataMutation.isPending,
    isGettingSuggestions: getPricingSuggestionsMutation.isPending,
    
    // تنظيف الأخطاء
    clearError: () => setError(null)
  };
}

// ===== هوك تحليل الأسعار =====
export function usePriceAnalysis() {
  const [analysis, setAnalysis] = useState<{
    avgPrice: number;
    minPrice: number;
    maxPrice: number;
    priceVariance: number;
    tierDistribution: Record<PricingTier, number>;
    recommendations: string[];
  } | null>(null);

  const analyzeUnits = useCallback((units: UnitManagementData[]) => {
    if (units.length === 0) {
      setAnalysis(null);
      return;
    }

    const prices = units.map(unit => {
      const activePricing = unit.activePricingRules?.find(rule => 
        new Date(rule.startDate) <= new Date() && 
        new Date(rule.endDate) >= new Date() &&
        rule.isActive
      );
      return activePricing?.priceAmount || unit.unit.basePrice;
    });

    const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceVariance = prices.reduce((sum, price) => sum + Math.pow(price - avgPrice, 2), 0) / prices.length;

    // توزيع الفئات
    const tierDistribution: Record<PricingTier, number> = {
      normal: 0,
      high: 0,
      peak: 0,
      discount: 0,
      custom: 0
    };

    units.forEach(unit => {
      const currentPrice = prices[units.indexOf(unit)];
      const ratio = currentPrice / unit.unit.basePrice;
      
      let tier: PricingTier = 'normal';
      if (ratio >= 1.5) tier = 'peak';
      else if (ratio >= 1.2) tier = 'high';
      else if (ratio <= 0.8) tier = 'discount';
      else if (ratio !== 1) tier = 'custom';
      
      tierDistribution[tier]++;
    });

    // توصيات
    const recommendations: string[] = [];
    
    if (priceVariance > avgPrice * 0.1) {
      recommendations.push('هناك تفاوت كبير في الأسعار - فكر في توحيد استراتيجية التسعير');
    }
    
    if (tierDistribution.discount > units.length * 0.3) {
      recommendations.push('نسبة عالية من الوحدات بأسعار مخفضة - تحقق من استراتيجية التسعير');
    }
    
    if (tierDistribution.peak > units.length * 0.2) {
      recommendations.push('نسبة عالية من أسعار الذروة - تأكد من مبررات هذه الأسعار');
    }

    setAnalysis({
      avgPrice,
      minPrice,
      maxPrice,
      priceVariance,
      tierDistribution,
      recommendations
    });
  }, []);

  return {
    analysis,
    analyzeUnits,
    clearAnalysis: () => setAnalysis(null)
  };
}

// ===== هوك مقارنة الأسعار =====
export function usePriceComparison() {
  const [comparisons, setComparisons] = useState<{
    unitId: string;
    currentPrice: number;
    suggestedPrice: number;
    marketAverage: number;
    competitorPrices: number[];
    pricePosition: 'below' | 'at' | 'above';
  }[]>([]);

  const compareUnitPrices = useCallback(async (units: UnitManagementData[]) => {
    const newComparisons = await Promise.all(
      units.map(async (unit) => {
        try {
          // محاولة الحصول على اقتراحات الأسعار
          const suggestions = await AvailabilityAndPricingService.pricing.getPricingSuggestions(
            unit.unit.unitId,
            {
              start: new Date().toISOString().split('T')[0],
              end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            }
          );

          const activePricing = unit.activePricingRules?.find(rule => 
            new Date(rule.startDate) <= new Date() && 
            new Date(rule.endDate) >= new Date()
          );
          
          const currentPrice = activePricing?.priceAmount || unit.unit.basePrice;
          
          let pricePosition: 'below' | 'at' | 'above' = 'at';
          if (currentPrice < suggestions.market_average * 0.95) pricePosition = 'below';
          else if (currentPrice > suggestions.market_average * 1.05) pricePosition = 'above';

          return {
            unitId: unit.unit.unitId,
            currentPrice,
            suggestedPrice: suggestions.suggested_price,
            marketAverage: suggestions.market_average,
            competitorPrices: [], // يمكن إضافة أسعار المنافسين هنا
            pricePosition
          };
        } catch (error) {
          // في حالة الخطأ، استخدم بيانات افتراضية
          const activePricing = unit.activePricingRules?.find(rule => 
            new Date(rule.startDate) <= new Date() && 
            new Date(rule.endDate) >= new Date()
          );
          
          const currentPrice = activePricing?.priceAmount || unit.unit.basePrice;
          
          return {
            unitId: unit.unit.unitId,
            currentPrice,
            suggestedPrice: currentPrice,
            marketAverage: currentPrice,
            competitorPrices: [],
            pricePosition: 'at' as const
          };
        }
      })
    );

    setComparisons(newComparisons);
  }, []);

  const getUnitComparison = useCallback((unitId: string) => {
    return comparisons.find(comp => comp.unitId === unitId);
  }, [comparisons]);

  return {
    comparisons,
    compareUnitPrices,
    getUnitComparison,
    clearComparisons: () => setComparisons([])
  };
}

// ===== هوك التحسين التلقائي للأسعار =====
export function usePriceOptimization() {
  const [optimizationResults, setOptimizationResults] = useState<{
    unitId: string;
    originalPrice: number;
    optimizedPrice: number;
    expectedRevenue: number;
    confidence: number;
    reasoning: string[];
  }[]>([]);
  
  const [isOptimizing, setIsOptimizing] = useState(false);

  const optimizePrices = useCallback(async (
    units: UnitManagementData[],
    criteria: {
      maximizeRevenue?: boolean;
      maximizeOccupancy?: boolean;
      competitivePricing?: boolean;
      seasonalAdjustment?: boolean;
    } = { maximizeRevenue: true }
  ) => {
    setIsOptimizing(true);
    
    try {
      const results = await Promise.all(
        units.map(async (unit) => {
          const activePricing = unit.activePricingRules?.find(rule => 
            new Date(rule.startDate) <= new Date() && 
            new Date(rule.endDate) >= new Date()
          );
          
          const originalPrice = activePricing?.priceAmount || unit.unit.basePrice;
          
          // خوارزمية التحسين البسيطة
          let optimizedPrice = originalPrice;
          const reasoning: string[] = [];
          
          // عامل الطلب
          const bookingCount = unit.upcomingBookings?.length || 0;
          if (bookingCount > 3) {
            optimizedPrice *= 1.15;
            reasoning.push('طلب عالي - زيادة السعر بنسبة 15%');
          } else if (bookingCount < 1) {
            optimizedPrice *= 0.9;
            reasoning.push('طلب منخفض - تخفيض السعر بنسبة 10%');
          }
          
          // عامل موسمي بسيط
          const month = new Date().getMonth();
          if ([11, 0, 1].includes(month)) { // شتاء
            optimizedPrice *= 1.1;
            reasoning.push('الموسم الشتوي - زيادة موسمية 10%');
          } else if ([5, 6, 7].includes(month)) { // صيف
            optimizedPrice *= 1.05;
            reasoning.push('الموسم الصيفي - زيادة موسمية 5%');
          }
          
          // حد أدنى وأعلى
          const minPrice = unit.unit.basePrice * 0.7;
          const maxPrice = unit.unit.basePrice * 2;
          optimizedPrice = Math.max(minPrice, Math.min(maxPrice, optimizedPrice));
          
          const expectedRevenue = optimizedPrice * Math.max(1, bookingCount);
          const confidence = Math.min(0.95, 0.6 + (bookingCount * 0.1));
          
          return {
            unitId: unit.unit.unitId,
            originalPrice,
            optimizedPrice: Math.round(optimizedPrice),
            expectedRevenue,
            confidence,
            reasoning
          };
        })
      );
      
      setOptimizationResults(results);
      return results;
    } catch (error) {
      console.error('خطأ في تحسين الأسعار:', error);
      throw error;
    } finally {
      setIsOptimizing(false);
    }
  }, []);

  const applyOptimization = useCallback(async (unitId: string, dateRange: { start: string; end: string }) => {
    const result = optimizationResults.find(r => r.unitId === unitId);
    if (!result) {
      throw new Error('لا توجد نتائج تحسين لهذه الوحدة');
    }

    try {
      await AvailabilityAndPricingService.pricing.quickUpdatePrice(
        unitId,
        result.optimizedPrice,
        dateRange
      );
      
      return result;
    } catch (error) {
      console.error('خطأ في تطبيق التحسين:', error);
      throw error;
    }
  }, [optimizationResults]);

  return {
    optimizationResults,
    isOptimizing,
    optimizePrices,
    applyOptimization,
    clearResults: () => setOptimizationResults([])
  };
}

// ===== هوك إحصائيات التسعير =====
export function usePricingStatistics(unitIds?: string[], dateRange?: { start: string; end: string }) {
  const [statistics, setStatistics] = useState<PricingStatistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStatistics = useCallback(async () => {
    if (!unitIds || unitIds.length === 0 || !dateRange) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const stats = await AvailabilityAndPricingService.management.getPricingStatistics(
        unitIds,
        dateRange
      );
      
      setStatistics(stats);
    } catch (err: any) {
      setError(err.message || 'خطأ في تحميل إحصائيات التسعير');
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