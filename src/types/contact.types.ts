// أنواع بيانات معلومات الاتصال (Contact)
// جميع الحقول موثقة بالعربي لضمان التوافق التام مع الباك اند

/**
 * بيانات معلومات الاتصال
 */
export interface ContactDto {
  /** رقم الهاتف الأساسي */
  primaryPhone?: string;
  /** رقم الهاتف الثانوي */
  secondaryPhone?: string;
  /** البريد الإلكتروني الأساسي */
  primaryEmail?: string;
  /** البريد الإلكتروني الثانوي */
  secondaryEmail?: string;
  /** الموقع الإلكتروني */
  website?: string;
  /** الفاكس */
  fax?: string;
  /** رقم الطوارئ */
  emergencyContact?: string;
  /** أفضل وقت للاتصال */
  bestTimeToContact?: string;
  /** لغة التواصل المفضلة */
  preferredLanguage?: string;
  /** الطريقة المفضلة للتواصل */
  preferredContactMethod?: string;
}
