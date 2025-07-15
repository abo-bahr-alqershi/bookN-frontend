import { apiClient } from './api.service';
import type { ResultDto, PaginatedResult } from '../types/common.types';
import type {
  StaffDto,
  AddStaffCommand,
  UpdateStaffCommand,
  RemoveStaffCommand,
  GetStaffByPositionQuery,
  GetStaffByPropertyQuery,
  GetStaffByUserQuery
} from '../types/staff.types';

// Base URL for admin staff endpoints
const API_BASE = '/api/admin/staff';

export const AdminStaffService = {
  // Add new staff member
  add: (data: AddStaffCommand) =>
    apiClient.post<ResultDto<string>>(`${API_BASE}/add`, data).then(res => res.data),

  // Update staff member details
  update: (data: UpdateStaffCommand) =>
    apiClient.put<ResultDto<boolean>>(`${API_BASE}/update`, data).then(res => res.data),

  // Remove a staff member
  remove: (data: RemoveStaffCommand) =>
    apiClient.post<ResultDto<boolean>>(`${API_BASE}/remove`, data).then(res => res.data),

  // Get staff by position
  getByPosition: (query: GetStaffByPositionQuery) =>
    apiClient.get<PaginatedResult<StaffDto>>(`${API_BASE}/by-position`, { params: query }).then(res => res.data),

  // Get staff by property
  getByProperty: (query: GetStaffByPropertyQuery) =>
    apiClient.get<PaginatedResult<StaffDto>>(`${API_BASE}/by-property`, { params: query }).then(res => res.data),

  // Get staff details by user
  getByUser: (query: GetStaffByUserQuery) =>
    apiClient.get<ResultDto<StaffDto>>(`${API_BASE}/by-user`, { params: query }).then(res => res.data),
}; 