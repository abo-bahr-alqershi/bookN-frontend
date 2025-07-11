import axios from 'axios';
import type { ResultDto, PaginatedResult } from '../types/amenity.types';
import type {
  BookingDto,
  BookingDetailsDto,
  ServiceDto,
  CreateBookingCommand,
  CancelBookingCommand,
  CheckInCommand,
  CheckOutCommand,
  CompleteBookingCommand,
  ConfirmBookingCommand,
  AddServiceToBookingCommand,
  RemoveServiceFromBookingCommand,
  UpdateBookingCommand,
  GetBookingsByPropertyQuery,
  GetBookingByIdQuery,
  GetBookingsByStatusQuery,
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

// المسار الأساسي لخدمة حجوزات المالك
const API_BASE = '/api/property/bookings';

// خدمات الحجوزات لأصحاب العقارات (Property Bookings Service)
export const PropertyBookingsService = {
  /** إنشاء حجز جديد */
  create: (data: CreateBookingCommand) =>
    axios.post<ResultDto<string>>(`${API_BASE}/create`, data).then(res => res.data),

  /** إلغاء حجز */
  cancel: (data: CancelBookingCommand) =>
    axios.post<ResultDto<boolean>>(`${API_BASE}/cancel`, data).then(res => res.data),

  /** تسجيل الوصول للحجز */
  checkIn: (data: CheckInCommand) =>
    axios.post<ResultDto<boolean>>(`${API_BASE}/check-in`, data).then(res => res.data),

  /** تسجيل مغادرة الحجز */
  checkOut: (data: CheckOutCommand) =>
    axios.post<ResultDto<boolean>>(`${API_BASE}/check-out`, data).then(res => res.data),

  /** إكمال الحجز */
  complete: (data: CompleteBookingCommand) =>
    axios.post<ResultDto<boolean>>(`${API_BASE}/complete`, data).then(res => res.data),

  /** تأكيد الحجز */
  confirm: (data: ConfirmBookingCommand) =>
    axios.post<ResultDto<boolean>>(`${API_BASE}/confirm`, data).then(res => res.data),

  /** إضافة خدمة للحجز */
  addService: (data: AddServiceToBookingCommand) =>
    axios.post<ResultDto<boolean>>(`${API_BASE}/add-service-to-booking`, data).then(res => res.data),

  /** إزالة خدمة من الحجز */
  removeService: (data: RemoveServiceFromBookingCommand) =>
    axios.post<ResultDto<boolean>>(`${API_BASE}/remove-service-from-booking`, data).then(res => res.data),

  /** تحديث بيانات الحجز */
  update: (bookingId: string, data: UpdateBookingCommand) =>
    axios.put<ResultDto<boolean>>(`${API_BASE}/${bookingId}/update`, data).then(res => res.data),

  /** جلب حجوزات العقار مع الفلاتر والصفحات */
  getByProperty: (query: GetBookingsByPropertyQuery) =>
    axios.get<PaginatedResult<BookingDto>>(`${API_BASE}`, { params: query }).then(res => res.data),

  /** جلب تفاصيل حجز بواسطة المعرف */
  getById: (query: GetBookingByIdQuery) =>
    axios.get<ResultDto<BookingDetailsDto>>(`${API_BASE}/${query.bookingId}`).then(res => res.data),

  /** جلب الحجوزات حسب الحالة */
  getByStatus: (query: GetBookingsByStatusQuery) =>
    axios.get<PaginatedResult<BookingDto>>(`${API_BASE}/status`, { params: query }).then(res => res.data),

  /** جلب الحجوزات حسب الوحدة */
  getByUnit: (query: GetBookingsByUnitQuery) =>
    axios.get<PaginatedResult<BookingDto>>(`${API_BASE}/unit/${query.unitId}`, { params: query }).then(res => res.data),

  /** جلب الحجوزات حسب المستخدم */
  getByUser: (query: GetBookingsByUserQuery) =>
    axios.get<PaginatedResult<BookingDto>>(`${API_BASE}/user/${query.userId}`, { params: query }).then(res => res.data),

  /** جلب خدمات الحجز */
  getServices: (query: GetBookingServicesQuery) =>
    axios.get<ResultDto<ServiceDto[]>>(`${API_BASE}/${query.bookingId}/services`).then(res => res.data),

  /** تقرير الحجوزات */
  getReport: (query: GetBookingReportQuery) =>
    axios.get<ResultDto<BookingReportDto>>(`${API_BASE}/report`, { params: query }).then(res => res.data),

  /** اتجاهات الحجوزات كسلسلة زمنية */
  getTrends: (query: GetBookingTrendsQuery) =>
    axios.get<TimeSeriesDataDto[]>(`${API_BASE}/trends`, { params: query }).then(res => res.data),

  /** تحليل نافذة الحجوزات */
  getWindowAnalysis: (query: GetBookingWindowAnalysisQuery) =>
    axios.get<BookingWindowDto>(`${API_BASE}/window-analysis/${query.propertyId}`).then(res => res.data),

  /** جلب الحجوزات في نطاق زمني */
  getByDateRange: (query: GetBookingsByDateRangeQuery) =>
    axios.get<PaginatedResult<BookingDto>>(`${API_BASE}/by-date-range`, { params: query }).then(res => res.data),
}; 