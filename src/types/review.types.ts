// أنواع بيانات التقييمات (Reviews)
// جميع الحقول موثقة بالعربي لضمان التوافق التام مع الباك اند

/**
 * صورة التقييم
 */
export interface ReviewImageDto {
  /** معرف الصورة */
  id: string;
  /** معرف التقييم */
  reviewId: string;
  /** اسم الملف */
  name: string;
  /** رابط الصورة */
  url: string;
  /** حجم الصورة بالبايت */
  sizeBytes: number;
  /** نوع المحتوى */
  type: string;
  /** فئة الصورة */
  category: string;
  /** تعليق توضيحي للصورة */
  caption: string;
  /** نص بديل للصورة */
  altText: string;
  /** تاريخ الرفع */
  uploadedAt: string;
}

/**
 * بيانات التقييم الأساسية
 */
export interface ReviewDto {
  /** معرف المراجعة */
  id: string;
  /** معرف الحجز */
  bookingId: string;
  /** تقييم النظافة */
  cleanliness: number;
  /** تقييم الخدمة */
  service: number;
  /** تقييم الموقع */
  location: number;
  /** تقييم القيمة */
  value: number;
  /** تعليق المراجعة */
  comment: string;
  /** تاريخ إنشاء المراجعة */
  createdAt: string;
  /** صور التقييم */
  images: ReviewImageDto[];
}

/**
 * أمر إنشاء تقييم جديد
 */
export interface CreateReviewCommand {
  bookingId: string;
  cleanliness: number;
  service: number;
  location: number;
  value: number;
  comment: string;
}

/**
 * استعلام جلب تقييم حسب الحجز
 */
export interface GetReviewByBookingQuery {
  bookingId: string;
}

/**
 * استعلام جلب تقييمات عقار مع التصفية والصفحات
 */
export interface GetReviewsByPropertyQuery {
  propertyId: string;
  pageNumber?: number;
  pageSize?: number;
  minRating?: number;
  maxRating?: number;
  isPendingApproval?: boolean;
  hasResponse?: boolean;
  reviewedAfter?: string;
  sortBy?: string;
}

/**
 * استعلام جلب تقييمات مستخدم مع التصفية والصفحات
 */
export interface GetReviewsByUserQuery {
  userId: string;
  pageNumber?: number;
  pageSize?: number;
  isPendingApproval?: boolean;
  hasResponse?: boolean;
  reviewedAfter?: string;
  sortBy?: string;
}

/**
 * استعلام جلب التقييمات المعلقة للموافقة
 */
export interface GetPendingReviewsQuery {}
