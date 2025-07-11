import axios from 'axios';
import type {
  UserDto,
  CreateUserCommand,
  UpdateUserCommand,
  ActivateUserCommand,
  DeactivateUserCommand,
  GetAllUsersQuery,
  SearchUsersQuery,
  GetUserByIdQuery,
  AssignUserRoleCommand,
  GetUsersByRoleQuery,
  GetUserActivityLogQuery,
  GetUserLifetimeStatsQuery,
  GetUserNotificationsQuery,
  GetUserRolesQuery,
} from '../types/user.types';
import type { ResultDto, PaginatedResult } from '../types/common.types';

// خدمات إدارة المستخدمين (Users Service)
export const AdminUsersService = {
  /** البحث عن المستخدمين */
  search: (query: SearchUsersQuery) =>
    axios.get<PaginatedResult<UserDto>>('/api/admin/Users/search', { params: query }).then(res => res.data),

  /** جلب جميع المستخدمين */
  getAll: (query?: GetAllUsersQuery) =>
    axios.get<PaginatedResult<UserDto>>('/api/admin/Users', { params: query }).then(res => res.data),

  /** جلب مستخدم بواسطة المعرف */
  getById: (query: GetUserByIdQuery) =>
    axios.get<ResultDto<UserDto>>(`/api/admin/Users/${query.userId}`).then(res => res.data),

  /** إنشاء مستخدم جديد */
  create: (data: CreateUserCommand) =>
    axios.post<ResultDto<string>>('/api/admin/Users', data).then(res => res.data),

  /** تحديث بيانات مستخدم */
  update: (userId: string, data: UpdateUserCommand) =>
    axios.put<ResultDto<boolean>>(`/api/admin/Users/${userId}`, data).then(res => res.data),

  /** تفعيل مستخدم */
  activate: (userId: string) =>
    axios.post<ResultDto<boolean>>(`/api/admin/Users/${userId}/activate`).then(res => res.data),

  /** إلغاء تفعيل مستخدم */
  deactivate: (userId: string) =>
    axios.post<ResultDto<boolean>>(`/api/admin/Users/${userId}/deactivate`).then(res => res.data),

  /** تخصيص دور للمستخدم */
  assignRole: (query: AssignUserRoleCommand) =>
    axios.post<ResultDto<boolean>>(`/api/admin/Users/${query.userId}/assign-role`, query).then(res => res.data),

  /** جلب المستخدمين حسب الدور */
  getByRole: (query: GetUsersByRoleQuery) =>
    axios.get<PaginatedResult<UserDto>>('/api/admin/Users/by-role', { params: query }).then(res => res.data),

  /** جلب سجلات نشاط المستخدم */
  getActivityLog: (query: GetUserActivityLogQuery) => {
    const { userId, from, to } = query;
    return axios
      .get<ResultDto<UserDto[]>>(`/api/admin/Users/${userId}/activity-log`, { params: { from, to } })
      .then(res => res.data);
  },

  /** جلب إحصائيات المستخدم مدى الحياة */
  getLifetimeStats: (query: GetUserLifetimeStatsQuery) =>
    axios.get<ResultDto<any>>(`/api/admin/Users/${query.userId}/lifetime-stats`).then(res => res.data),

  /** جلب إشعارات المستخدم */
  getNotifications: (query: GetUserNotificationsQuery) => {
    const { userId, ...params } = query;
    return axios
      .get<PaginatedResult<any>>(`/api/admin/Users/${userId}/notifications`, { params })
      .then(res => res.data);
  },

  /** جلب أدوار المستخدم */
  getRoles: (query: GetUserRolesQuery) =>
    axios.get<PaginatedResult<string>>(`/api/admin/Users/${query.userId}/roles`, { params: query }).then(res => res.data),
};
