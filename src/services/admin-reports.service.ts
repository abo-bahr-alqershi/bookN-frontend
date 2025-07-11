// خدمات البلاغات (Reports Service)
// جميع الدوال موثقة بالعربي وتدعم العمليات الأساسية
import axios from 'axios';
import type { ResultDto, PaginatedResult } from '../types/common.types';
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

/**
 * دوال التعامل مع البلاغات عبر API
 */
export class AdminReportsService {
  // المسار الأساسي لتعاملات البلاغات للمدراء
  private static readonly API_BASE = '/api/admin/Reports';

  /** جلب جميع البلاغات مع الفلاتر والصفحات */
  static async getAll(query?: GetAllReportsQuery): Promise<PaginatedResult<ReportDto>> {
    const response = await axios.get<PaginatedResult<ReportDto>>(this.API_BASE, { params: query });
    return response.data;
  }

  /** جلب تقرير حسب المعرف */
  static async getById(query: GetReportByIdQuery): Promise<ResultDto<ReportDto>> {
    const response = await axios.get<ResultDto<ReportDto>>(`${this.API_BASE}/${query.id}`);
    return response.data;
  }

  /** إنشاء تقرير جديد */
  static async create(data: CreateReportCommand): Promise<ResultDto<string>> {
    const response = await axios.post<ResultDto<string>>(this.API_BASE, data);
    return response.data;
  }

  /** تحديث تقرير */
  static async update(reportId: string, data: UpdateReportCommand): Promise<ResultDto<boolean>> {
    const response = await axios.put<ResultDto<boolean>>(`${this.API_BASE}/${reportId}`, data);
    return response.data;
  }

  /** حذف تقرير */
  static async delete(id: string, deletionReason?: string): Promise<ResultDto<boolean>> {
    const response = await axios.delete<ResultDto<boolean>>(`${this.API_BASE}/${id}`, { data: deletionReason ? { deletionReason } : undefined });
    return response.data;
  }

  /** جلب البلاغات حسب العقار */
  static async getByProperty(propertyId: string, query?: any): Promise<ReportDto[]> {
    const response = await axios.get<PaginatedResult<ReportDto>>(`${this.API_BASE}/property/${propertyId}`, { params: query });
    return response.data.items;
  }

  /** جلب البلاغات حسب المستخدم المبلغ عنه */
  static async getByReportedUser(reportedUserId: string, query?: any): Promise<ReportDto[]> {
    const response = await axios.get<PaginatedResult<ReportDto>>(`${this.API_BASE}/reported-user/${reportedUserId}`, { params: query });
    return response.data.items;
  }
}
