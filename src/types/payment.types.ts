// أنواع بيانات المدفوعات (Payments)
// جميع الحقول موثقة بالعربي لضمان التوافق التام مع الباك اند

/**
 * بيانات المبلغ المالي
 */
export interface MoneyDto {
  /** المبلغ المالي */
  amount: number;
  /** رمز العملة */
  currency: string;
  /** المبلغ المنسق للعرض */
  formattedAmount: string;
}

/**
 * طرق الدفع
 * (تم التحويل إلى نوع union string لضمان التوافق مع إعدادات TypeScript الحديثة)
 */
export type PaymentMethod = 'Card' | 'Cash' | 'Wallet';

/**
 * حالات الدفع
 * (تم التحويل إلى نوع union string لضمان التوافق مع إعدادات TypeScript الحديثة)
 */
export type PaymentStatus =
  | 'Successful'
  | 'Failed'
  | 'Pending'
  | 'Refunded'
  | 'Voided'
  | 'PartiallyRefunded';

/**
 * بيانات الدفعة الأساسية
 */
export interface PaymentDto {
  /** معرف الدفعة */
  id: string;
  /** معرف الحجز */
  bookingId: string;
  /** المبلغ المدفوع */
  amount: MoneyDto;
  /** رقم المعاملة */
  transactionId: string;
  /** طريقة الدفع */
  method: PaymentMethod;
  /** حالة الدفع */
  status: PaymentStatus;
  /** تاريخ الدفع */
  paymentDate: string;
}

/**
 * أمر لاسترداد الدفعة
 */
export interface RefundPaymentCommand {
  /** معرف الدفعة */
  paymentId: string;
  /** المبلغ المسترد */
  refundAmount: MoneyDto;
  /** سبب الاسترداد */
  refundReason: string;
}

/**
 * أمر لإبطال الدفعة
 */
export interface VoidPaymentCommand {
  /** معرف الدفعة */
  paymentId: string;
}

/**
 * أمر لتحديث حالة الدفعة
 */
export interface UpdatePaymentStatusCommand {
  /** معرف الدفعة */
  paymentId: string;
  /** الحالة الجديدة للدفع */
  newStatus: PaymentStatus;
}

/**
 * أمر لمعالجة الدفع
 */
export interface ProcessPaymentCommand {
  /** معرف الحجز */
  bookingId: string;
  /** مبلغ الدفع */
  amount: MoneyDto;
  /** طريقة الدفع */
  method: PaymentMethod;
}

/**
 * استعلام جلب دفعة بواسطة المعرف
 */
export interface GetPaymentByIdQuery {
  /** معرف الدفعة */
  paymentId: string;
}

/**
 * استعلام جلب المدفوعات حسب الحجز
 */
export interface GetPaymentsByBookingQuery {
  /** معرف الحجز */
  bookingId: string;
  /** رقم الصفحة */
  pageNumber?: number;
  /** حجم الصفحة */
  pageSize?: number;
}

/**
 * استعلام جلب المدفوعات حسب الحالة
 */
export interface GetPaymentsByStatusQuery {
  /** حالة الدفع */
  status: PaymentStatus;
  /** رقم الصفحة */
  pageNumber?: number;
  /** حجم الصفحة */
  pageSize?: number;
}

/**
 * استعلام جلب المدفوعات حسب المستخدم
 */
export interface GetPaymentsByUserQuery {
  /** معرف المستخدم */
  userId: string;
  /** رقم الصفحة */
  pageNumber?: number;
  /** حجم الصفحة */
  pageSize?: number;
}

/**
 * استعلام جلب المدفوعات حسب طريقة الدفع
 */
export interface GetPaymentsByMethodQuery {
  /** طريقة الدفع */
  paymentMethod: PaymentMethod;
  /** رقم الصفحة */
  pageNumber?: number;
  /** حجم الصفحة */
  pageSize?: number;
}
