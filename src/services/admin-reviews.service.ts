// خدمات التقييمات (Reviews Service)
// جميع الدوال موثقة بالعربي وتدعم العمليات الأساسية
import type {
  ReviewDto,
  ReviewImageDto,
  CreateReviewCommand,
  GetReviewByBookingQuery,
  GetReviewsByPropertyQuery,
  GetReviewsByUserQuery,
  GetPendingReviewsQuery
} from '../types/review.types';
import axios from 'axios';
import type { ResultDto } from '../types/amenity.types';

/**
 * دوال التعامل مع التقييمات عبر API
 */
export class AdminReviewsService {
  /** جلب تقييم حسب الحجز */
  static async getByBooking(bookingId: string): Promise<ReviewDto> {
    return fetch(`/api/admin/reviews/booking/${bookingId}`).then(res => res.json());
  }

  /** جلب تقييمات عقار مع التصفية والصفحات */
  static async getByProperty(query: GetReviewsByPropertyQuery): Promise<ReviewDto[]> {
    const params = `?${Object.entries(query).map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`).join('&')}`;
    return fetch(`/api/admin/reviews/property/${query.propertyId}${params}`).then(res => res.json());
  }

  /** جلب تقييمات مستخدم مع التصفية والصفحات */
  static async getByUser(query: GetReviewsByUserQuery): Promise<ReviewDto[]> {
    const params = `?${Object.entries(query).map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`).join('&')}`;
    return fetch(`/api/admin/reviews/user/${query.userId}${params}`).then(res => res.json());
  }

  /** جلب التقييمات المعلقة للموافقة */
  static async getPending(query?: GetPendingReviewsQuery): Promise<ReviewDto[]> {
    return fetch('/api/admin/reviews/pending').then(res => res.json());
  }

  /** الموافقة على تقييم */
  static async approve(reviewId: string): Promise<ResultDto<boolean>> {
    return axios.post<ResultDto<boolean>>(`/api/admin/reviews/${reviewId}/approve`).then(res => res.data);
  }

  /** حذف تقييم */
  static async deleteReview(reviewId: string): Promise<ResultDto<boolean>> {
    return axios.delete<ResultDto<boolean>>(`/api/admin/reviews/${reviewId}`).then(res => res.data);
  }
}
