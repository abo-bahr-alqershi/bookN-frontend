import axios from 'axios';
import type { PaymentDto, RefundPaymentCommand, VoidPaymentCommand, UpdatePaymentStatusCommand } from '../types/payment.types';
import type { ResultDto } from '../types/amenity.types';

// خدمات المدفوعات (Payments Service) للإدارة
export const PaymentsService = {
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
};
