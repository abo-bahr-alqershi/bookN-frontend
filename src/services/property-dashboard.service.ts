import axios from 'axios';
import type { OwnerDashboardDto, GetOwnerDashboardQuery } from '../types/dashboard.types';
import type { ResultDto } from '../types/common.types';
import type { ExportDashboardReportCommand } from '../types/dashboard.types';

// Base URL for property owner dashboard endpoints
const API_BASE = '/api/property/dashboard';

export const PropertyDashboardService = {
  /** Get owner dashboard data */
  getOwnerDashboard: (query: GetOwnerDashboardQuery) =>
    axios.post<OwnerDashboardDto>(`${API_BASE}/owner`, query).then(res => res.data),

  /** Export dashboard report */
  exportReport: (data: ExportDashboardReportCommand) =>
    axios.post(`${API_BASE}/export`, data, { responseType: 'blob' }).then(res => res.data),

  /** Get customer report */
  getCustomerReport: (query: any) =>
    axios.get<any>(`${API_BASE}/customer-report`, { params: query }).then(res => res.data),

  /** Get financial summary */
  getFinancialSummary: (query: any) =>
    axios.get<any>(`${API_BASE}/financial-summary`, { params: query }).then(res => res.data),

  /** Get property performance */
  getPropertyPerformance: (query: any) =>
    axios.post<any>(`${API_BASE}/performance`, query).then(res => res.data),

  /** Get property performance comparison */
  getPropertyPerformanceComparison: (query: any) =>
    axios.post<any>(`${API_BASE}/performance-comparison`, query).then(res => res.data),

  /** Get occupancy rate */
  getOccupancyRate: (query: any) =>
    axios.post<any>(`${API_BASE}/occupancy-rate`, query).then(res => res.data),

  /** Get occupancy report */
  getOccupancyReport: (query: any) =>
    axios.post<any>(`${API_BASE}/occupancy-report`, query).then(res => res.data),

  /** Get revenue report */
  getRevenueReport: (query: any) =>
    axios.post<any>(`${API_BASE}/revenue-report`, query).then(res => res.data),

  /** Get platform cancellation analysis */
  getPlatformCancellationAnalysis: (query: any) =>
    axios.post<any>(`${API_BASE}/cancellation-analysis`, query).then(res => res.data),

  /** Get platform revenue breakdown */
  getPlatformRevenueBreakdown: (query: any) =>
    axios.post<any>(`${API_BASE}/revenue-breakdown`, query).then(res => res.data),

  /** Get user acquisition funnel */
  getUserAcquisitionFunnel: (query: any) =>
    axios.post<any>(`${API_BASE}/user-acquisition-funnel`, query).then(res => res.data),

  /** Get top performing properties */
  getTopPerformingProperties: (count: number) =>
    axios.get<any>(`${API_BASE}/top-properties/${count}`).then(res => res.data),
}; 