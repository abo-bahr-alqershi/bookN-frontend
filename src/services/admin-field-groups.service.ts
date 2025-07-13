import axios from 'axios';
import type { ResultDto } from '../types/common.types';
import type {
  FieldGroupDto,
  CreateFieldGroupCommand,
  UpdateFieldGroupCommand,
  DeleteFieldGroupCommand,
  ReorderFieldGroupsCommand,
  GetFieldGroupByIdQuery,
  GetFieldGroupsByUnitTypeQuery,
  AssignFieldToGroupCommand
} from '../types/field-group.types';

// المسار الأساسي لخدمة مجموعات الحقول للإدمن
const API_BASE = '/api/admin/fieldgroups';

/**
 * خدمات إدارة مجموعات الحقول للإدمن
 */
export const AdminFieldGroupsService = {
  /** إنشاء مجموعة حقول جديدة */
  create: (command: CreateFieldGroupCommand) =>
    axios.post<ResultDto<FieldGroupDto>>(API_BASE, command).then(res => res.data),

  /** تحديث مجموعة حقول */
  update: (command: UpdateFieldGroupCommand) =>
    axios.put<ResultDto<FieldGroupDto>>(
      `${API_BASE}/${command.groupId}`,
      command
    ).then(res => res.data),

  /** حذف مجموعة حقول */
  delete: (command: DeleteFieldGroupCommand) =>
    axios.delete<ResultDto<boolean>>(`${API_BASE}/${command.groupId}`).then(res => res.data),

  /** إعادة ترتيب مجموعات الحقول */
  reorder: (command: ReorderFieldGroupsCommand) =>
    axios.post<ResultDto<boolean>>(
      `${API_BASE}/reorder`,
      command
    ).then(res => res.data),

  /** جلب مجموعة حقول بواسطة المعرف */
  getById: (query: GetFieldGroupByIdQuery) =>
    axios.get<FieldGroupDto>(`${API_BASE}/${query.groupId}`).then(res => res.data),

  /** جلب مجموعات الحقول حسب نوع الوحدة */
  getByUnitType: (query: GetFieldGroupsByUnitTypeQuery) =>
    axios.get<FieldGroupDto[]>(`${API_BASE}/unit-type/${query.unitTypeId}`).then(res => res.data),

  /** تخصيص حقل لمجموعة */
  assignField: (command: AssignFieldToGroupCommand) =>
    axios.post<ResultDto<boolean>>(
      `${API_BASE}/${command.groupId}/assign-field`,
      command
    ).then(res => res.data)
}; 