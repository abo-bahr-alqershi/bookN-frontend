import { apiClient } from './api.service';
import type { RoleDto, CreateRoleCommand, UpdateRoleCommand, DeleteRoleCommand, GetAllRolesQuery } from '../types/role.types';
import type { ResultDto, PaginatedResult } from '../types/common.types';

// خدمات إدارة الأدوار (Roles Service)
export const AdminRolesService = {
  /** جلب جميع الأدوار مع صفحات */
  getAll: (query?: GetAllRolesQuery) =>
    apiClient.get<PaginatedResult<RoleDto>>('/api/admin/Roles', { params: query }).then(res => res.data),

  /** جلب دور بواسطة المعرف */
  getById: (roleId: string) =>
    apiClient.get<ResultDto<RoleDto>>(`/api/admin/Roles/${roleId}`).then(res => res.data),

  /** إنشاء دور جديد */
  create: (data: CreateRoleCommand) =>
    apiClient.post<ResultDto<string>>('/api/admin/Roles', data).then(res => res.data),

  /** تعديل دور */
  update: (roleId: string, data: UpdateRoleCommand) =>
    apiClient.put<ResultDto<boolean>>(`/api/admin/Roles/${roleId}`, data).then(res => res.data),

  /** حذف دور */
  delete: (roleId: string) =>
    apiClient.delete<ResultDto<boolean>>(`/api/admin/Roles/${roleId}`).then(res => res.data),
};
