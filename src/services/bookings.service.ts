import axios from 'axios';
import type {
  BookingDto,
  BookingDetailsDto,
  CreateBookingCommand,
  UpdateBookingCommand,
  GetBookingByIdQuery,
  CancelBookingCommand,
  ServiceDto,
  GetBookingsByStatusQuery,
  GetBookingsByPropertyQuery,
  GetBookingsByUnitQuery,
  GetBookingsByUserQuery,
  GetBookingServicesQuery,
  GetBookingsByDateRangeQuery,
  GetBookingReportQuery,
  GetBookingTrendsQuery,
  GetBookingWindowAnalysisQuery,
  BookingReportDto,
  TimeSeriesDataDto,
  BookingWindowDto,
} from '../types/booking.types';
import type { ResultDto, PaginatedResult } from '../types/amenity.types';

// مسار الـ API الخاص بالحجوزات للإدارة
const API_BASE = '/api/admin/Bookings';

/**
 * جميع خدمات الحجوزات للإدارة
 * موثقة بالعربي لضمان الوضوح والتوافق مع الباك اند
 */
export const BookingsService = {
  // جلب الحجوزات حسب الحالة مع صفحات وفلاتر
  getBookingsByStatus: (query: GetBookingsByStatusQuery) =>
    axios.get<PaginatedResult<BookingDto>>(`${API_BASE}/status`, { params: query }).then(res => res.data),
  // جلب الحجوزات حسب العقار مع صفحات وفلاتر
  getBookingsByProperty: (query: GetBookingsByPropertyQuery) =>
    axios.get<PaginatedResult<BookingDto>>(`${API_BASE}/property/${query.propertyId}`, { params: query }).then(res => res.data),
  // جلب الحجوزات حسب الوحدة مع صفحات وفلاتر
  getBookingsByUnit: (query: GetBookingsByUnitQuery) =>
    axios.get<PaginatedResult<BookingDto>>(`${API_BASE}/unit/${query.unitId}`, { params: query }).then(res => res.data),
  // جلب الحجوزات حسب المستخدم مع صفحات وفلاتر
  getBookingsByUser: (query: GetBookingsByUserQuery) =>
    axios.get<PaginatedResult<BookingDto>>(`${API_BASE}/user/${query.userId}`, { params: query }).then(res => res.data),
  // جلب خدمات الحجز
  getBookingServices: (bookingId: string) =>
    axios.get<ResultDto<ServiceDto[]>>(`${API_BASE}/${bookingId}/services`).then(res => res.data),
  // تقرير الحجوزات
  getBookingReport: (query: GetBookingReportQuery) =>
    axios.get<ResultDto<BookingReportDto>>(`${API_BASE}/report`, { params: query }).then(res => res.data),
  // اتجاهات الحجوزات كسلسلة زمنية
  getBookingTrends: (query: GetBookingTrendsQuery) =>
    axios.get<ResultDto<TimeSeriesDataDto[]>>(
      `${API_BASE}/trends`,
      { params: { propertyId: query.propertyId, startDate: query.range.startDate, endDate: query.range.endDate } }
    ).then(res => res.data),
  // تحليل نافذة الحجوزات لعقار معين
  getBookingWindowAnalysis: (propertyId: string) =>
    axios.get<ResultDto<BookingWindowDto>>(`${API_BASE}/window-analysis/${propertyId}`).then(res => res.data),
  // جلب الحجوزات في نطاق زمني مع صفحات وفلاتر
  getBookingsByDateRange: (query: GetBookingsByDateRangeQuery) =>
    axios.get<PaginatedResult<BookingDto>>(`${API_BASE}/by-date-range`, { params: query }).then(res => res.data),

  // جلب تفاصيل حجز بواسطة المعرف
  getBookingById: (bookingId: string) =>
    axios.get<ResultDto<BookingDetailsDto>>(`${API_BASE}/${bookingId}`).then(res => res.data),

  // إنشاء حجز جديد
  createBooking: (data: CreateBookingCommand) =>
    axios.post<ResultDto<string>>(`${API_BASE}`, data).then(res => res.data),

  // تحديث بيانات حجز
  updateBooking: (bookingId: string, data: UpdateBookingCommand) =>
    axios.put<ResultDto<boolean>>(`${API_BASE}/${bookingId}`, data).then(res => res.data),
  // إلغاء حجز
  cancelBooking: (bookingId: string, data: CancelBookingCommand) =>
    axios.post<ResultDto<boolean>>(`${API_BASE}/${bookingId}/cancel`, data).then(res => res.data),

  // حذف حجز (إذا توفر endpoint)
  // deleteBooking: (bookingId: string) =>
  //   axios.delete<ResultDto<boolean>>(`${API_BASE}/${bookingId}`),
};
