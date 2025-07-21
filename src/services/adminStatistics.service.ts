import axios from 'axios';
import type { DashboardStatsDto } from '../types/dashboard.types';

const API_URL = '/api/admin/dashboard';

export async function fetchDashboardStats(): Promise<DashboardStatsDto> {
  const response = await axios.get<DashboardStatsDto>(`${API_URL}/stats`);
  return response.data;
} 