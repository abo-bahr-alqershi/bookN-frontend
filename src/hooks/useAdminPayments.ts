import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminPaymentsService } from '../services/admin-payments.service';
import type { PaymentDto, GetPaymentsByStatusQuery, RefundPaymentCommand, VoidPaymentCommand, UpdatePaymentStatusCommand } from '../types/payment.types';
import type { PaginatedResult, ResultDto } from '../types/common.types';

/**
 * هوك لإدارة استعلامات وعمليات المدفوعات للإدارة
 * يعزل التعامل مع react-query وخدمات المدفوعات في مكان واحد
 * @param params معايير استعلام المدفوعات (الحالة، ترقيم الصفحات)
 * @returns بيانات المدفوعات وحالات التحميل والأخطاء ودوال الاسترداد والإبطال وتحديث الحالة
 */
export const useAdminPayments = (params: GetPaymentsByStatusQuery) => {
  const queryClient = useQueryClient();
  const queryKey = ['admin-payments', params] as const;

  // جلب المدفوعات حسب الحالة مع الفلاتر والصفحات
  const { data: paymentsData, isLoading, error } = useQuery<PaginatedResult<PaymentDto>, Error>({
    queryKey,
    queryFn: () => AdminPaymentsService.getByStatus(params)
  });

  // استرداد الدفعة
  const refundPayment = useMutation<ResultDto<boolean>, Error, RefundPaymentCommand>({
    mutationFn: (data) => AdminPaymentsService.refund(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-payments'] });
    },
  });

  // إبطال الدفعة
  const voidPayment = useMutation<ResultDto<boolean>, Error, VoidPaymentCommand>({
    mutationFn: (data) => AdminPaymentsService.void(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-payments'] });
    },
  });

  // تحديث حالة الدفعة
  const updatePaymentStatus = useMutation<ResultDto<boolean>, Error, { paymentId: string; data: UpdatePaymentStatusCommand }>({
    mutationFn: ({ paymentId, data }) => AdminPaymentsService.updateStatus(paymentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-payments'] });
    },
  });

  return { paymentsData, isLoading, error, refundPayment, voidPayment, updatePaymentStatus };
}; 