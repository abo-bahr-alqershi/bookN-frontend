import axios from 'axios';
import type { ResultDto, PaginatedResult } from '../types/amenity.types';
import type {
  UserDto,
  RegisterPropertyOwnerCommand,
  UpdateUserCommand,
  GetUserByIdQuery,
  GetUsersByRoleQuery,
  GetUserByEmailQuery,
  SearchUsersQuery,
  GetUserActivityLogQuery,
  GetUserLifetimeStatsQuery,
  GetUserNotificationsQuery,
} from '../types/user.types';

// المسار الأساسي لتعاملات المستخدمين لأصحاب العقارات
const API_BASE = '/api/property/users';

export const PropertyUsersService = {
  // تسجيل صاحب عقار جديد
  registerPropertyOwner: (data: RegisterPropertyOwnerCommand) =>
    axios.post<ResultDto<string>>(`${API_BASE}/register`, data).then(res => res.data),

  // تحديث بيانات المستخدم
  update: (userId: string, data: UpdateUserCommand) =>
    axios.put<ResultDto<boolean>>(`${API_BASE}/${userId}`, data).then(res => res.data),

  // جلب بيانات المستخدم بواسطة المعرف
  getById: (query: GetUserByIdQuery) =>
    axios.get<ResultDto<UserDto>>(`${API_BASE}/${query.userId}`).then(res => res.data),

  // جلب المستخدمين حسب الدور
  getByRole: (query: GetUsersByRoleQuery) =>
    axios.get<PaginatedResult<UserDto>>(`${API_BASE}/by-role`, { params: query }).then(res => res.data),

  // جلب بيانات المستخدم بواسطة البريد الإلكتروني
  getByEmail: (query: GetUserByEmailQuery) =>
    axios.get<ResultDto<UserDto>>(`${API_BASE}/by-email`, { params: query }).then(res => res.data),

  // البحث عن المستخدمين
  search: (query: SearchUsersQuery) =>
    axios.get<PaginatedResult<UserDto>>(`${API_BASE}/search`, { params: query }).then(res => res.data),

  // جلب سجلات نشاط المستخدم
  getActivityLog: (query: GetUserActivityLogQuery) =>
    axios.get<ResultDto<UserDto[]>>(`${API_BASE}/${query.userId}/activity-log`, { params: query }).then(res => res.data),

  // جلب إحصائيات المستخدم مدى الحياة
  getLifetimeStats: (query: GetUserLifetimeStatsQuery) =>
    axios.get<ResultDto<any>>(`${API_BASE}/${query.userId}/lifetime-stats`).then(res => res.data),

  // جلب إشعارات المستخدم
  getNotifications: (query: GetUserNotificationsQuery) =>
    axios.get<PaginatedResult<any>>(`${API_BASE}/${query.userId}/notifications`, { params: query }).then(res => res.data),
};