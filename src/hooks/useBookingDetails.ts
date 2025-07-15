import { useQuery } from '@tanstack/react-query';
import { AdminBookingsService } from '../services/admin-bookings.service';
import type { BookingDto, GetBookingByIdQuery } from '../types/booking.types';

/**
 * هوك لجلب تفاصيل حجز واحد للإدارة
 * يعزل استعلام التفاصيل عن الصفحة ويعالج حالة التحميل والأخطاء
 * @param bookingId معرف الحجز
 * @param enabled تفعيل الاستعلام
 * @returns بيانات تفاصيل الحجز وحالة التحميل والأخطاء
 */
export const useBookingDetails = (bookingId?: string, enabled = false) => {
  return useQuery<BookingDto, Error>({
    queryKey: ['booking-details', bookingId] as const,
    queryFn: async () => {
      const data = await AdminBookingsService.getById({ bookingId: bookingId! }).then(res => res.data);
      if (!data) {
        throw new Error('Booking not found');
      }
      return data;
    },
    enabled: !!bookingId && enabled
  });
}; 