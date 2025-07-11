// أنواع بيانات العناوين الجغرافية (Address)
// جميع الحقول موثقة بالعربي لضمان التوافق التام مع الباك اند

/**
 * بيانات العنوان الجغرافي
 */
export interface AddressDto {
  /** الشارع أو العنوان التفصيلي */
  street: string;
  /** المدينة */
  city: string;
  /** المحافظة أو الولاية */
  state?: string;
  /** الدولة */
  country: string;
  /** الرمز البريدي */
  postalCode?: string;
  /** خط العرض */
  latitude?: number;
  /** خط الطول */
  longitude?: number;
  /** العنوان الكامل (مركب) */
  fullAddress?: string;
  /** هل توجد إحداثيات GPS */
  hasCoordinates?: boolean;
}
