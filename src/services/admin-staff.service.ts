import axios from 'axios';
import type { ResultDto, PaginatedResult } from '../types/amenity.types';
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
    axios.post<ResultDto<string>>(`${API_BASE}/add`, data).then(res => res.data),

  // Update staff member details
  update: (data: UpdateStaffCommand) =>
    axios.put<ResultDto<boolean>>(`${API_BASE}/update`, data).then(res => res.data),

  // Remove a staff member
  remove: (data: RemoveStaffCommand) =>
    axios.post<ResultDto<boolean>>(`${API_BASE}/remove`, data).then(res => res.data),

  // Get staff by position
  getByPosition: (query: GetStaffByPositionQuery) =>
    axios.get<PaginatedResult<StaffDto>>(`${API_BASE}/by-position`, { params: query }).then(res => res.data),

  // Get staff by property
  getByProperty: (query: GetStaffByPropertyQuery) =>
    axios.get<PaginatedResult<StaffDto>>(`${API_BASE}/by-property`, { params: query }).then(res => res.data),

  // Get staff details by user
  getByUser: (query: GetStaffByUserQuery) =>
    axios.get<ResultDto<StaffDto>>(`${API_BASE}/by-user`, { params: query }).then(res => res.data),
}; 