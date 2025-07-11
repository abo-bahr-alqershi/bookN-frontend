import axios from 'axios';
import type {
  BookingDto,
  BookingDetailsDto,
  CreateBookingCommand,
  UpdateBookingCommand,
  GetBookingByIdQuery,
} from '../types/booking.types';
import type { ResultDto, PaginatedResult } from '../types/amenity.types';

// مسار الـ API الخاص بالحجوزات للإدارة
const API_BASE = '/api/admin/bookings';

/**
 * جميع خدمات الحجوزات للإدارة
 * موثقة بالعربي لضمان الوضوح والتوافق مع الباك اند
 */
export const BookingsService = {
  // جلب جميع الحجوزات مع صفحات وفلاتر
  getAllBookings: (params?: Record<string, any>) =>
    axios.get<PaginatedResult<BookingDto>>(`${API_BASE}`, { params }),

  // جلب تفاصيل حجز بواسطة المعرف
  getBookingById: (bookingId: string) =>
    axios.get<ResultDto<BookingDetailsDto>>(`${API_BASE}/${bookingId}`),

  // إنشاء حجز جديد
  createBooking: (data: CreateBookingCommand) =>
    axios.post<ResultDto<string>>(`${API_BASE}`, data),

  // تحديث بيانات حجز
  updateBooking: (bookingId: string, data: UpdateBookingCommand) =>
    axios.put<ResultDto<boolean>>(`${API_BASE}/${bookingId}`, data),

  // حذف حجز (إذا توفر endpoint)
  // deleteBooking: (bookingId: string) =>
  //   axios.delete<ResultDto<boolean>>(`${API_BASE}/${bookingId}`),
};
