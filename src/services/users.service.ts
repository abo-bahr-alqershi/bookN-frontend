import axios from 'axios';
import type {
  UserDto,
  CreateUserCommand,
  UpdateUserCommand,
  ActivateUserCommand,
  DeactivateUserCommand,
  GetAllUsersQuery,
  SearchUsersQuery,
} from '../types/user.types';
import type { ResultDto, PaginatedResult } from '../types/amenity.types';

const API_BASE = '/api/admin/users';

export const UsersService = {
  // جلب جميع المستخدمين مع صفحات
  getAllUsers: (params?: GetAllUsersQuery) =>
    axios.get<PaginatedResult<UserDto>>(`${API_BASE}`, { params }),

  // البحث عن المستخدمين
  searchUsers: (params: SearchUsersQuery) =>
    axios.get<PaginatedResult<UserDto>>(`${API_BASE}/search`, { params }),

  // جلب مستخدم بواسطة المعرف
  getUserById: (userId: string) =>
    axios.get<ResultDto<UserDto>>(`${API_BASE}/${userId}`),

  // إنشاء مستخدم جديد
  createUser: (data: CreateUserCommand) =>
    axios.post<ResultDto<string>>(`${API_BASE}`, data),

  // تحديث بيانات مستخدم
  updateUser: (userId: string, data: UpdateUserCommand) =>
    axios.put<ResultDto<boolean>>(`${API_BASE}/${userId}`, data),

  // تفعيل مستخدم
  activateUser: (userId: string) =>
    axios.post<ResultDto<boolean>>(`${API_BASE}/${userId}/activate`),

  // إلغاء تفعيل مستخدم
  deactivateUser: (userId: string) =>
    axios.post<ResultDto<boolean>>(`${API_BASE}/${userId}/deactivate`),
};
