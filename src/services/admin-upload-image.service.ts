import { apiClient } from './api.service';
import type { ResultDto } from '../types/common.types';
import type { UploadImageCommand } from '../types/upload-image.types';

export interface AdminUploadImageResponse {
  success: boolean;
  taskId: string;
  url: string;
}
export const AdminUploadImageService = {
  /** Upload image for admin */
  upload: (command: UploadImageCommand) =>
    apiClient
      .post<AdminUploadImageResponse>('/api/admin/uploadimage', command)
      .then(res => res.data),
}; 