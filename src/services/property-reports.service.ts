import axios from 'axios';
import type { ResultDto, PaginatedResult } from '../types/amenity.types';
import type {
  ReportDto,
  CreateReportCommand,
  UpdateReportCommand,
  DeleteReportCommand,
  GetReportByIdQuery,
  GetAllReportsQuery,
  GetReportsByPropertyQuery,
  GetReportsByReportedUserQuery,
} from '../types/report.types';

// المسار الأساسي لتعاملات التقارير لأصحاب العقارات
const API_BASE = '/api/property/reports';

export const PropertyReportsService = {
  // إنشاء تقرير جديد
  create: (data: CreateReportCommand) =>
    axios.post<ResultDto<string>>(API_BASE, data).then(res => res.data),

  // تحديث تقرير
  update: (reportId: string, data: UpdateReportCommand) =>
    axios.put<ResultDto<boolean>>(`${API_BASE}/${reportId}`, data).then(res => res.data),

  // حذف تقرير
  delete: (reportId: string) =>
    axios.delete<ResultDto<boolean>>(`${API_BASE}/${reportId}`).then(res => res.data),

  // جلب جميع التقارير
  getAll: (params?: GetAllReportsQuery) =>
    axios.get<PaginatedResult<ReportDto>>(`${API_BASE}`, { params }).then(res => res.data),

  // جلب تقرير بواسطة المعرف
  getById: (reportId: string) =>
    axios.get<ResultDto<ReportDto>>(`${API_BASE}/${reportId}`).then(res => res.data),

  // جلب التقارير حسب عقار
  getByProperty: (propertyId: string, params?: GetReportsByPropertyQuery) =>
    axios.get<PaginatedResult<ReportDto>>(`${API_BASE}/property/${propertyId}`, { params }).then(res => res.data),

  // جلب التقارير حسب مستخدم مبلّغ
  getByReportedUser: (reportedUserId: string, params?: GetReportsByReportedUserQuery) =>
    axios.get<PaginatedResult<ReportDto>>(`${API_BASE}/reported-user/${reportedUserId}`, { params }).then(res => res.data),
};