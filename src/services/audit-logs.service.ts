// خدمات سجلات التدقيق والأنشطة (Audit Logs & Activity Logs)
// جميع الدوال موثقة بالعربي وتدعم نقاط نهاية الأدمن ومالك العقار

import type { AuditLogDto } from '../types/audit-log.types';
import axios from 'axios';

/**
 * استعلام سجلات أنشطة الأدمن
 */
export async function getAdminActivityLogs(params: Record<string, any>): Promise<AuditLogDto[]> {
  const { data } = await axios.get<AuditLogDto[]>('/api/admin/audit-logs/admin-activity', { params });
  return data;
}

/**
 * استعلام جميع سجلات التدقيق
 */
export async function getAuditLogs(params: Record<string, any>): Promise<AuditLogDto[]> {
  const { data } = await axios.get<AuditLogDto[]>('/api/admin/audit-logs', { params });
  return data;
}

/**
 * استعلام أنشطة العملاء
 */
export async function getCustomerActivityLogs(params: Record<string, any>, isAdmin = true): Promise<AuditLogDto[]> {
  const url = isAdmin ? '/api/admin/audit-logs/customer-activity' : '/api/property/audit-logs/customer-activity';
  const { data } = await axios.get<AuditLogDto[]>(url, { params });
  return data;
}

/**
 * استعلام أنشطة العقارات
 */
export async function getPropertyActivityLogs(params: Record<string, any>, isAdmin = true): Promise<AuditLogDto[]> {
  const url = isAdmin ? '/api/admin/audit-logs/property-activity' : '/api/property/audit-logs/property-activity';
  const { data } = await axios.get<AuditLogDto[]>(url, { params });
  return data;
}
