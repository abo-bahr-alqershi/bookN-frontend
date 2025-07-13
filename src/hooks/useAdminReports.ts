import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminReportsService } from '../services/admin-reports.service';
import type {
  GetAllReportsQuery,
  CreateReportCommand,
  UpdateReportCommand,
  DeleteReportCommand
} from '../types/report.types';

// Extended interface for admin reports management
export interface ReportActionCommand {
  id: string;
  action: 'review' | 'resolve' | 'dismiss' | 'escalate' | 'investigate';
  actionNote?: string;
  adminId: string;
}

export interface ReportStatsDto {
  totalReports: number;
  pendingReports: number;
  resolvedReports: number;
  dismissedReports: number;
  escalatedReports: number;
  averageResolutionTime: number;
  reportsByCategory: Record<string, number>;
  reportsTrend: Array<{
    date: string;
    count: number;
  }>;
}

export const useAdminReports = (query: GetAllReportsQuery) => {
  const queryClient = useQueryClient();

  // Get reports
  const {
    data: reportsData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['admin-reports', query],
    queryFn: () => AdminReportsService.getAll(query),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Create report
  const createReport = useMutation({
    mutationFn: (command: CreateReportCommand) => AdminReportsService.create(command),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reports'] });
    },
  });

  // Update report
  const updateReport = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateReportCommand }) => 
      AdminReportsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reports'] });
    },
  });

  // Delete report
  const deleteReport = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => 
      AdminReportsService.delete(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reports'] });
    },
  });

  // Take action on report
  const takeReportAction = useMutation({
    mutationFn: async (command: ReportActionCommand) => {
      // This would be implemented in the backend
      // For now, we'll update the report with the action
      const updateCommand: UpdateReportCommand = {
        id: command.id,
        description: `${command.action}: ${command.actionNote || ''}`
      };
      return AdminReportsService.update(command.id, updateCommand);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reports'] });
    },
  });

  // Bulk actions
  const bulkActionReports = useMutation({
    mutationFn: async ({ ids, action, note }: { 
      ids: string[]; 
      action: string; 
      note?: string 
    }) => {
      // Process each report
      const promises = ids.map(id => 
        AdminReportsService.update(id, { 
          id, 
          description: `Bulk ${action}: ${note || ''}` 
        })
      );
      return Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reports'] });
    },
  });

  return {
    // Data
    reportsData,
    isLoading,
    error,
    
    // Actions
    refetch,
    createReport,
    updateReport,
    deleteReport,
    takeReportAction,
    bulkActionReports,
  };
};

// Hook for single report
export const useReport = (id: string) => {
  return useQuery({
    queryKey: ['admin-report', id],
    queryFn: () => AdminReportsService.getById({ id }),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook for reports by property
export const useReportsByProperty = (propertyId: string, query?: any) => {
  return useQuery({
    queryKey: ['reports-by-property', propertyId, query],
    queryFn: () => AdminReportsService.getByProperty(propertyId, query),
    enabled: !!propertyId,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook for reports by user
export const useReportsByUser = (userId: string, query?: any) => {
  return useQuery({
    queryKey: ['reports-by-user', userId, query],
    queryFn: () => AdminReportsService.getByReportedUser(userId, query),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook for report statistics
export const useReportStats = () => {
  return useQuery({
    queryKey: ['report-stats'],
    queryFn: async (): Promise<ReportStatsDto> => {
      // Mock implementation - replace with actual API call
      return {
        totalReports: 324,
        pendingReports: 45,
        resolvedReports: 210,
        dismissedReports: 69,
        escalatedReports: 12,
        averageResolutionTime: 2.5, // days
        reportsByCategory: {
          'سلوك غير لائق': 85,
          'محتوى مضلل': 62,
          'انتهاك الشروط': 45,
          'مشكلة فنية': 38,
          'أخرى': 94
        },
        reportsTrend: [
          { date: '2024-01-01', count: 15 },
          { date: '2024-01-02', count: 22 },
          { date: '2024-01-03', count: 18 },
          { date: '2024-01-04', count: 25 },
          { date: '2024-01-05', count: 19 },
          { date: '2024-01-06', count: 30 },
          { date: '2024-01-07', count: 27 }
        ]
      };
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};