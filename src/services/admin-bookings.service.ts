import axios from 'axios';
import type { ResultDto, PaginatedResult } from '../types/common.types';
import type { ServiceDto } from '../types/service.types';
import type {
  BookingDto,
  BookingReportDto,
  TimeSeriesDataDto,
  BookingWindowDto,
  // Commands
  CancelBookingCommand,
  UpdateBookingCommand,
  ConfirmBookingCommand,
  CompleteBookingCommand,
  CheckInCommand,
  CheckOutCommand,
  AddServiceToBookingCommand,
  RemoveServiceFromBookingCommand,
  // Queries
  GetBookingByIdQuery,
  GetBookingsByPropertyQuery,
  GetBookingsByStatusQuery,
  GetBookingsByUnitQuery,
  GetBookingsByUserQuery,
  GetBookingServicesQuery,
  GetBookingReportQuery,
  GetBookingTrendsQuery,
  GetBookingWindowAnalysisQuery,
  GetBookingsByDateRangeQuery
} from '../types/booking.types';

// المسار الأساسي لخدمة حجوزات الإدارة
const API_BASE = '/api/admin/bookings';

/**
 * خدمات إدارة الحجوزات للإدمن
 */
export const AdminBookingsService = {
  /** إلغاء حجز */
  cancel: (command: CancelBookingCommand) =>
    axios.post<ResultDto<boolean>>(
      `${API_BASE}/${command.bookingId}/cancel`,
      command
    ).then(res => res.data),

  /** تحديث بيانات الحجز */
  update: (command: UpdateBookingCommand) =>
    axios.put<ResultDto<boolean>>(
      `${API_BASE}/${command.bookingId}/update`,
      command
    ).then(res => res.data),

  /** جلب بيانات حجز بواسطة المعرف */
  getById: (query: GetBookingByIdQuery) =>
    axios.get<ResultDto<BookingDto>>(
      `${API_BASE}/${query.bookingId}`
    ).then(res => res.data),

  /** جلب الحجوزات حسب العقار مع فلترة وتصفح */
  getByProperty: (query: GetBookingsByPropertyQuery) => {
    const { propertyId, ...params } = query;
    return axios.get<PaginatedResult<BookingDto>>(
      `${API_BASE}/property/${propertyId}`,
      { params }
    ).then(res => res.data);
  },

  /** جلب الحجوزات حسب الحالة */
  getByStatus: (query: GetBookingsByStatusQuery) =>
    axios.get<PaginatedResult<BookingDto>>(
      `${API_BASE}/status`,
      { params: query }
    ).then(res => res.data),

  /** جلب الحجوزات حسب الوحدة */
  getByUnit: (query: GetBookingsByUnitQuery) => {
    const { unitId, ...params } = query;
    return axios.get<PaginatedResult<BookingDto>>(
      `${API_BASE}/unit/${unitId}`,
      { params }
    ).then(res => res.data);
  },

  /** جلب الحجوزات حسب المستخدم */
  getByUser: (query: GetBookingsByUserQuery) => {
    const { userId, ...params } = query;
    return axios.get<PaginatedResult<BookingDto>>(
      `${API_BASE}/user/${userId}`,
      { params }
    ).then(res => res.data);
  },

  /** جلب خدمات الحجز */
  getServices: (query: GetBookingServicesQuery) =>
    axios.get<ResultDto<ServiceDto[]>>(
      `${API_BASE}/${query.bookingId}/services`
    ).then(res => res.data),

  /** استعلام تقرير الحجوزات اليومية */
  getReport: (query: GetBookingReportQuery) =>
    axios.get<ResultDto<BookingReportDto>>(
      `${API_BASE}/report`,
      { params: query }
    ).then(res => res.data),

  /** استعلام اتجاهات الحجوزات كسلسلة زمنية */
  getTrends: (query: GetBookingTrendsQuery) =>
    axios.get<TimeSeriesDataDto[]>(
      `${API_BASE}/trends`,
      { params: query }
    ).then(res => res.data),

  /** استعلام تحليل نافذة الحجز لعقار */
  getWindowAnalysis: (query: GetBookingWindowAnalysisQuery) =>
    axios.get<BookingWindowDto>(
      `${API_BASE}/window-analysis/${query.propertyId}`
    ).then(res => res.data),

  /** استعلام الحجوزات في نطاق زمني */
  getByDateRange: (query: GetBookingsByDateRangeQuery) =>
    axios.get<PaginatedResult<BookingDto>>(
      `${API_BASE}/by-date-range`,
      { params: query }
    ).then(res => res.data)
}; 