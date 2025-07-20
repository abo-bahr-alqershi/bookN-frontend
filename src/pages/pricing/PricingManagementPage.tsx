import React, { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import DateRangeCalendar from '../../components/common/DateRangeCalendar';
import { AvailabilityAndPricingService } from '../../services/availability.services';
import { format } from 'date-fns';
import type { CreatePricingRequest, UnitManagementData, PriceType } from '../../types/availability_types';

const PricingManagementPage: React.FC = () => {
  const { unitId } = useParams<{ unitId: string }>();
  const queryClient = useQueryClient();

  // Fetch unit data
  const { data: unitData, isLoading, error } = useQuery<UnitManagementData, Error>({
    queryKey: ['unit-management', unitId!],
    queryFn: () => AvailabilityAndPricingService.management.getUnitManagementData(unitId!),
    enabled: !!unitId,
  });

  // Date range for pricing
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });

  // Form fields
  const [priceType, setPriceType] = useState<PriceType>('base');
  const [priceAmount, setPriceAmount] = useState<string>('');
  const [percentageChange, setPercentageChange] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Feedback
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Mutation to create pricing
  const createPricing = useMutation<unknown, Error, CreatePricingRequest, unknown>({
    mutationFn: (req: CreatePricingRequest) => AvailabilityAndPricingService.pricing.createPricing(req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unit-management', unitId!] });
      setMessage({ text: 'تم حفظ قاعدة التسعير بنجاح', type: 'success' });
      // reset form
      setDateRange({ start: null, end: null });
      setPriceAmount(''); setPercentageChange(''); setNotes('');
    },
    onError: (err: any) => {
      setMessage({ text: err.message || 'حدث خطأ أثناء الحفظ', type: 'error' });
    }
  });

  const handleConfirm = useCallback(() => {
    if (!unitId || !dateRange.start || !dateRange.end) {
      setMessage({ text: 'يرجى اختيار الفترة وملء الحقول', type: 'error' });
      return;
    }
    const req: CreatePricingRequest = {
      unitId: unitId!,
      priceType,
      startDate: format(dateRange.start, 'yyyy-MM-dd'),
      endDate: format(dateRange.end, 'yyyy-MM-dd'),
      priceAmount: Number(priceAmount),
      pricingTier: 'custom',
      percentageChange: percentageChange ? Number(percentageChange) : undefined,
      description: notes || undefined,
    };
    setSubmitting(true);
    createPricing.mutate(req, {
      onSettled: () => setSubmitting(false)
    });
  }, [unitId, dateRange, priceType, priceAmount, percentageChange, notes, createPricing]);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">إدارة التسعير</h1>

      {/* Pricing form card */}
      {dateRange.start && dateRange.end && (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-2">تفاصيل التسعير للفترة المحددة</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">نوع السعر</label>
              <select
                value={priceType}
                onChange={e => setPriceType(e.target.value as PriceType)}
                className="w-full border rounded px-2 py-1"
              >
                <option value="base">أساسي</option>
                <option value="custom">مخصص</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium">المبلغ</label>
              <input
                type="number"
                value={priceAmount}
                onChange={e => setPriceAmount(e.target.value)}
                className="w-full border rounded px-2 py-1"
                placeholder="أدخل المبلغ"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">نسبة التغيير (%)</label>
              <input
                type="number"
                value={percentageChange}
                onChange={e => setPercentageChange(e.target.value)}
                className="w-full border rounded px-2 py-1"
                placeholder="مثلاً 10 أو -5"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block mb-1 font-medium">ملاحظات</label>
              <textarea
                rows={3}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full border rounded px-2 py-1"
                placeholder="أدخل أي ملاحظات إضافية"
              />
            </div>
            <div className="sm:col-span-2 text-right">
              <button
                onClick={handleConfirm}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                disabled={submitting}
              >
                {submitting ? 'جارٍ الحفظ...' : 'تأكيد'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Calendar */}
      <DateRangeCalendar
        units={unitData ? [unitData] : []}
        onDateSelect={setDateRange}
      />

      {/* Loading & Error */}
      {isLoading && <div className="mt-4 text-center">جارٍ التحميل...</div>}
      {error && <div className="mt-4 text-red-600">{error.message}</div>}

      {/* Feedback message */}
      {message && (
        <div className={`mt-4 p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}
    </div>
  );
};

export default PricingManagementPage;