import axios from 'axios';
import type { PaymentDto, RefundPaymentCommand, VoidPaymentCommand, UpdatePaymentStatusCommand, GetPaymentsByBookingQuery, GetPaymentsByMethodQuery, GetPaymentsByStatusQuery, GetPaymentsByUserQuery } from '../types/payment.types';
import type { ResultDto, PaginatedResult } from '../types/amenity.types';

// خدمات المدفوعات (Payments Service) للإدارة
export const AdminPaymentsService = {
  /** استرجاع دفعة */
  refund: (data: RefundPaymentCommand) =>
    axios.post<ResultDto<boolean>>('/api/admin/Payments/refund', data).then(res => res.data),

  /** إبطال دفعة */
  void: (data: VoidPaymentCommand) =>
    axios.post<ResultDto<boolean>>('/api/admin/Payments/void', data).then(res => res.data),

  /** تحديث حالة الدفعة */
  updateStatus: (paymentId: string, data: UpdatePaymentStatusCommand) =>
    axios.put<ResultDto<boolean>>(`/api/admin/Payments/${paymentId}/status`, data).then(res => res.data),

  /** جلب دفعة حسب المعرف */
  getById: (paymentId: string) =>
    axios.get<ResultDto<PaymentDto>>(`/api/admin/Payments/${paymentId}`).then(res => res.data),
  /** جلب دفعات حسب الحجز */
  getByBooking: (query: GetPaymentsByBookingQuery) =>
    axios.get<PaginatedResult<PaymentDto>>(`/api/admin/Payments/booking/${query.bookingId}`, { params: { pageNumber: query.pageNumber, pageSize: query.pageSize } }).then(res => res.data),

  /** جلب دفعات حسب الطريقة */
  getByMethod: (query: GetPaymentsByMethodQuery) =>
    axios.get<PaginatedResult<PaymentDto>>(`/api/admin/Payments/method/${query.paymentMethod}`, { params: { pageNumber: query.pageNumber, pageSize: query.pageSize } }).then(res => res.data),

  /** جلب دفعات حسب الحالة */
  getByStatus: (query?: GetPaymentsByStatusQuery) =>
    axios.get<PaginatedResult<PaymentDto>>('/api/admin/Payments/status', { params: query }).then(res => res.data),

  /** جلب دفعات حسب المستخدم */
  getByUser: (query: GetPaymentsByUserQuery) =>
    axios.get<PaginatedResult<PaymentDto>>(`/api/admin/Payments/user/${query.userId}`, { params: { pageNumber: query.pageNumber, pageSize: query.pageSize } }).then(res => res.data),
};
