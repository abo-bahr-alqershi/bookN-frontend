import axios from 'axios';
import type {
  AdminDashboardDto,
  GetAdminDashboardQuery,
  ExportDashboardReportCommand,
  CustomerReportDto,
  GetCustomerReportQuery,
  FinancialSummaryDto,
  GetFinancialSummaryQuery,
  PropertyPerformanceDto,
  GetPropertyPerformanceQuery,
  PerformanceComparisonDto,
  GetPropertyPerformanceComparisonQuery,
  OccupancyReportDto,
  GetOccupancyRateQuery,
  GetOccupancyReportQuery,
  RevenueReportDto,
  GetRevenueReportQuery,
  CancellationReasonDto,
  GetPlatformCancellationAnalysisQuery,
  RevenueBreakdownDto,
  GetPlatformRevenueBreakdownQuery,
  UserFunnelDto,
  GetUserAcquisitionFunnelQuery,
  CohortDto,
  GetCustomerCohortAnalysisQuery,
  ReviewSentimentDto,
  PropertyDto,
  GetTopPerformingPropertiesQuery
} from '../types/dashboard.types';

// Base URL for admin dashboard endpoints
const API_BASE = '/api/admin/dashboard';

export const AdminDashboardService = {
  /** Get admin dashboard data */
  getAdminDashboard: (query: GetAdminDashboardQuery) =>
    axios.post<AdminDashboardDto>(`${API_BASE}/dashboard`, query).then(res => res.data),

  /** Export dashboard report */
  exportReport: (command: ExportDashboardReportCommand) =>
    axios.post<ArrayBuffer>(`${API_BASE}/dashboard/export`, command, { responseType: 'arraybuffer' }).then(res => res.data),

  /** Get customer report */
  getCustomerReport: (query: GetCustomerReportQuery) =>
    axios.get<CustomerReportDto>(`${API_BASE}/dashboard/customer-report`, { params: query }).then(res => res.data),

  /** Get financial summary */
  getFinancialSummary: (query: GetFinancialSummaryQuery) =>
    axios.get<FinancialSummaryDto>(`${API_BASE}/dashboard/financial-summary`, { params: query }).then(res => res.data),

  /** Get property performance */
  getPropertyPerformance: (query: GetPropertyPerformanceQuery) =>
    axios.post<PropertyPerformanceDto>(`${API_BASE}/dashboard/performance`, query).then(res => res.data),

  /** Get property performance comparison */
  getPropertyPerformanceComparison: (query: GetPropertyPerformanceComparisonQuery) =>
    axios.post<PerformanceComparisonDto>(`${API_BASE}/dashboard/performance-comparison`, query).then(res => res.data),

  /** Get occupancy rate */
  getOccupancyRate: (query: GetOccupancyRateQuery) =>
    axios.post<number>(`${API_BASE}/dashboard/occupancy-rate`, query).then(res => res.data),

  /** Get occupancy report */
  getOccupancyReport: (query: GetOccupancyReportQuery) =>
    axios.post<OccupancyReportDto>(`${API_BASE}/dashboard/occupancy-report`, query).then(res => res.data),

  /** Get revenue report */
  getRevenueReport: (query: GetRevenueReportQuery) =>
    axios.post<RevenueReportDto>(`${API_BASE}/dashboard/revenue-report`, query).then(res => res.data),

  /** Get platform cancellation analysis */
  getPlatformCancellationAnalysis: (query: GetPlatformCancellationAnalysisQuery) =>
    axios.post<CancellationReasonDto[]>(`${API_BASE}/dashboard/cancellation-analysis`, query).then(res => res.data),

  /** Get platform revenue breakdown */
  getPlatformRevenueBreakdown: (query: GetPlatformRevenueBreakdownQuery) =>
    axios.post<RevenueBreakdownDto>(`${API_BASE}/dashboard/revenue-breakdown`, query).then(res => res.data),

  /** Get user acquisition funnel */
  getUserAcquisitionFunnel: (query: GetUserAcquisitionFunnelQuery) =>
    axios.post<UserFunnelDto>(`${API_BASE}/dashboard/user-acquisition-funnel`, query).then(res => res.data),

  /** Get customer cohort analysis */
  getCustomerCohortAnalysis: (query: GetCustomerCohortAnalysisQuery) =>
    axios.post<CohortDto[]>(`${API_BASE}/dashboard/customer-cohort-analysis`, query).then(res => res.data),

  /** Get review sentiment analysis */
  getReviewSentimentAnalysis: (propertyId: string) =>
    axios.get<ReviewSentimentDto>(`${API_BASE}/review-sentiment-analysis/${propertyId}`).then(res => res.data),

  /** Get top performing properties */
  getTopPerformingProperties: (query: GetTopPerformingPropertiesQuery) =>
    axios.get<PropertyDto[]>(`${API_BASE}/top-properties/${query.count}`).then(res => res.data),
}; 