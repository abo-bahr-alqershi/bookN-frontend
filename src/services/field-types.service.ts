// خدمات أنواع الحقول (Field Types Service)
// جميع الدوال موثقة بالعربي وتدعم العمليات الأساسية
import type {
  FieldTypeDto,
  CreateFieldTypeCommand,
  UpdateFieldTypeCommand,
  DeleteFieldTypeCommand,
  ToggleFieldTypeStatusCommand,
  GetFieldTypeByIdQuery,
  GetAllFieldTypesQuery,
  SearchFieldTypesQuery
} from '../types/field-type.types';

/**
 * دوال التعامل مع أنواع الحقول للمدراء عبر API
 */
export class FieldTypesService {
  // المسار الأساسي لتعاملات أنواع الحقول للمدراء
  private static readonly API_BASE = '/api/admin/FieldTypes';

  /** جلب جميع أنواع الحقول مع إمكانية التصفية */
  static async getAll(query?: GetAllFieldTypesQuery): Promise<FieldTypeDto[]> {
    const params = query && query.isActive !== undefined ? `?isActive=${query.isActive}` : '';
    return fetch(`${this.API_BASE}${params}`).then(res => res.json());
  }

  /** جلب نوع حقل حسب المعرف */
  static async getById(fieldTypeId: string): Promise<FieldTypeDto> {
    return fetch(`${this.API_BASE}/${fieldTypeId}`).then(res => res.json());
  }

  /** إنشاء نوع حقل جديد */
  static async create(data: CreateFieldTypeCommand): Promise<FieldTypeDto> {
    return fetch(this.API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(res => res.json());
  }

  /** تحديث نوع الحقل */
  static async update(data: UpdateFieldTypeCommand): Promise<FieldTypeDto> {
    return fetch(`${this.API_BASE}/${data.fieldTypeId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(res => res.json());
  }

  /** حذف نوع الحقل */
  static async delete(fieldTypeId: string): Promise<void> {
    await fetch(`${this.API_BASE}/${fieldTypeId}`, { method: 'DELETE' });
  }

  /** تبديل حالة نوع الحقل */
  static async toggleStatus(data: ToggleFieldTypeStatusCommand): Promise<boolean> {
    return fetch(`${this.API_BASE}/${data.fieldTypeId}/toggle-status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: data.isActive }),
    }).then(res => res.json());
  }

  /** البحث في أنواع الحقول */
  static async search(query: SearchFieldTypesQuery): Promise<FieldTypeDto[]> {
    const params = `?searchTerm=${encodeURIComponent(query.searchTerm)}${query.isActive !== undefined ? `&isActive=${query.isActive}` : ''}`;
    return fetch(`${this.API_BASE}/search${params}`).then(res => res.json());
  }
}
