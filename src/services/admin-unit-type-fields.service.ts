import axios from 'axios';
import type {
  CreateUnitTypeFieldCommand,
  UpdateUnitTypeFieldCommand,
  DeleteUnitTypeFieldCommand,
  ToggleUnitTypeFieldStatusCommand,
  ReorderUnitTypeFieldsCommand,
  GetUnitTypeFieldsQuery,
  GetUnitTypeFieldByIdQuery,
  GetUnitTypeFieldsGroupedQuery,
  AssignFieldToGroupCommand,
  AssignFieldsToGroupCommand,
  BulkAssignFieldsToGroupsCommand,
  RemoveFieldFromGroupCommand,
  ReorderFieldsInGroupCommand,
  FieldGroupWithFieldsDto,
  GetUngroupedFieldsQuery,
  BulkAssignFieldToGroupCommand,
} from '../types/unit-type-field.types';
import type { UnitTypeFieldDto } from '../types/unit-type-field.types';
import type { ResultDto } from '../types/common.types';
import type { PaginatedResult } from '../types/common.types';

/**
 * خدمات الحقول الديناميكية لنوع الوحدة (Admin)
 */
export const AdminUnitTypeFieldsService = {
  // Admin endpoints
  /** إنشاء حقل نوع الوحدة */
  create: (data: CreateUnitTypeFieldCommand) =>
    axios.post<ResultDto<string>>('/api/admin/unit-type-fields', data).then(res => res.data),

  /** تحديث بيانات حقل نوع الوحدة */
  update: (fieldId: string, data: UpdateUnitTypeFieldCommand) =>
    axios.put<ResultDto<boolean>>(`/api/admin/unit-type-fields/${fieldId}`, data).then(res => res.data),

  /** حذف حقل نوع الوحدة */
  delete: (fieldId: string) =>
    axios.delete<ResultDto<boolean>>(`/api/admin/unit-type-fields/${fieldId}`).then(res => res.data),

  /** تبديل حالة تفعيل حقل نوع الوحدة */
  toggleStatus: (fieldId: string, data: ToggleUnitTypeFieldStatusCommand) =>
    axios.patch<ResultDto<boolean>>(`/api/admin/unit-type-fields/${fieldId}/toggle-status`, data).then(res => res.data),

  /** إعادة ترتيب الحقول الديناميكية لنوع الوحدة */
  reorder: (data: ReorderUnitTypeFieldsCommand) =>
    axios.post<ResultDto<boolean>>('/api/admin/unit-type-fields/reorder', data).then(res => res.data),

  /** جلب الحقول لنوع وحدة معين */
  getByUnitType: (query: GetUnitTypeFieldsQuery) =>
    axios.get<UnitTypeFieldDto[]>(`/api/admin/unit-type-fields/unit-type/${query.unitTypeId}`, { params: query }).then(res => res.data),

  /** جلب بيانات حقل نوع الوحدة بواسطة المعرف */
  getById: (query: GetUnitTypeFieldByIdQuery) =>
    axios.get<ResultDto<UnitTypeFieldDto>>(`/api/admin/unit-type-fields/${query.fieldId}`, { params: query }).then(res => res.data),

  /** جلب الحقول الديناميكية مجمعة حسب المجموعات */
  getGrouped: (query: GetUnitTypeFieldsGroupedQuery) =>
    axios.get<FieldGroupWithFieldsDto[]>(`/api/admin/unit-type-fields/grouped`, { params: query }).then(res => res.data),

  /** تخصيص حقل لمجموعة */
  assignFieldToGroup: (groupId: string, data: AssignFieldToGroupCommand) =>
    axios.post<ResultDto<boolean>>(`/api/admin/unit-type-fields/${groupId}/assign-fields`, data).then(res => res.data),

  /** إسناد عدة حقول لمجموعة */
  assignFieldsToGroup: (data: AssignFieldsToGroupCommand) =>
    axios.post<ResultDto<boolean>>(`/api/admin/unit-type-fields/bulk-assign-fields`, data).then(res => res.data),

  /** إزالة حقل من مجموعة */
  removeFieldFromGroup: (data: RemoveFieldFromGroupCommand) =>
    axios.post<ResultDto<boolean>>(`/api/admin/unit-type-fields/${data.groupId}/remove-field`, data).then(res => res.data),

  /** إعادة ترتيب الحقول ضمن مجموعة */
  reorderFieldsInGroup: (data: ReorderFieldsInGroupCommand) =>
    axios.post<ResultDto<boolean>>(`/api/admin/unit-type-fields/reorder-fields`, data).then(res => res.data),

  /**
   * جلب الحقول غير المجمعة ضمن أي مجموعة لنوع الوحدة
   */
  getUngroupedFields: (query: GetUngroupedFieldsQuery) =>
    axios.get<PaginatedResult<UnitTypeFieldDto>>(`/api/admin/unit-type-fields/ungrouped-fields/${query.unitTypeId}`, { params: query }).then(res => res.data),

  /**
   * bulk assign للحقول لمجموعة واحدة
   */
  bulkAssignFieldToGroup: (groupId: string, data: BulkAssignFieldToGroupCommand) =>
    axios.post<ResultDto<boolean>>(`/api/admin/unit-type-fields/${groupId}/bulk-assign-field`, data).then(res => res.data),
};