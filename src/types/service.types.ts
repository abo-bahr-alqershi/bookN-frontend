// أنواع بيانات الخدمات (Services)
import type { MoneyDto } from './amenity.types';
// جميع الحقول موثقة بالعربي لضمان الوضوح والتوافق مع الباك اند

/**
 * بيانات الخدمة الأساسية
 */
export interface ServiceDto {
  /** معرف الخدمة */
  id: string;
  /** اسم الخدمة */
  name: string;
  /** وصف الخدمة */
  description: string;
  /** نوع الخدمة (تنظيف، نقل، إلخ) */
  type: string;
  /** تفاصيل الخدمة (JSON) */
  details: Record<string, any>;
  /** حالة التفعيل */
  isActive: boolean;
  /** سعر الخدمة */
  price: number;
  /** تاريخ الإنشاء */
  createdAt: string;
  /** تاريخ آخر تحديث */
  updatedAt: string;
}

/**
 * أمر إنشاء خدمة جديدة
 */
export interface CreateServiceCommand {
  name: string;
  description: string;
  type: string;
  details: Record<string, any>;
  price: number;
}

/**
 * أمر تحديث خدمة
 */
export interface UpdateServiceCommand {
  serviceId: string;
  name: string;
  description: string;
  type: string;
  details: Record<string, any>;
  price: number;
}

/**
 * أمر حذف خدمة
 */
export interface DeleteServiceCommand {
  serviceId: string;
}

/**
 * تفاصيل الخدمة
 */
export interface ServiceDetailsDto {
  /** معرف الخدمة */
  id: string;
  /** معرف العقار */
  propertyId: string;
  /** اسم العقار */
  propertyName: string;
  /** اسم الخدمة */
  name: string;
  /** سعر الخدمة */
  price: MoneyDto;
  /** نموذج التسعير */
  pricingModel: string;
}

/**
 * استعلام لجلب خدمات العقار
 */
export interface GetPropertyServicesQuery {
  /** معرف العقار */
  propertyId: string;
}

/**
 * استعلام لجلب بيانات خدمة بواسطة المعرف
 */
export interface GetServiceByIdQuery {
  /** معرف الخدمة */
  serviceId: string;
}

/**
 * استعلام لجلب الخدمات حسب النوع
 */
export interface GetServicesByTypeQuery {
  /** نوع الخدمة */
  serviceType: string;
  /** رقم الصفحة */
  pageNumber?: number;
  /** حجم الصفحة */
  pageSize?: number;
}
