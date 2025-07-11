import axios from 'axios';
import type { ResultDto } from '../types/common.types';
import type {
  ReviewDto,
  ApproveReviewCommand,
  DeleteReviewCommand,
  RespondToReviewCommand,
  GetReviewByBookingQuery,
  GetReviewsByPropertyQuery,
  GetReviewsByUserQuery,
} from '../types/review.types';

// المسار الأساسي لتعاملات التقييمات لأصحاب العقارات
const API_BASE = '/api/property/reviews';

export const PropertyReviewsService = {
  // الموافقة على تقييم
  approve: (reviewId: string, data: ApproveReviewCommand) =>
    axios.post<ResultDto<boolean>>(`${API_BASE}/${reviewId}/approve`, data).then(res => res.data),

  // حذف تقييم
  delete: (reviewId: string) =>
    axios.delete<ResultDto<boolean>>(`${API_BASE}/${reviewId}`).then(res => res.data),

  // الرد على تقييم
  respond: (reviewId: string, data: RespondToReviewCommand) =>
    axios.post<ResultDto<boolean>>(`${API_BASE}/${reviewId}/respond`, data).then(res => res.data),

  // جلب تقييم حسب الحجز
  getByBooking: (query: GetReviewByBookingQuery) =>
    axios.get<ResultDto<ReviewDto>>(`${API_BASE}/booking/${query.bookingId}`).then(res => res.data),

  // جلب تقييمات عقار معين
  getByProperty: (query: GetReviewsByPropertyQuery) =>
    axios.get<ResultDto<ReviewDto[]>>(`${API_BASE}/property/${query.propertyId}`, { params: query }).then(res => res.data),

  // جلب تقييمات مستخدم
  getByUser: (query: GetReviewsByUserQuery) =>
    axios.get<ResultDto<ReviewDto[]>>(`${API_BASE}/user/${query.userId}`, { params: query }).then(res => res.data),
};