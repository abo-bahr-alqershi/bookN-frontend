import { apiClient } from './api.service';
import type { ResultDto } from '../types/common.types';
import type { UploadImageCommand } from '../types/upload-image.types';

export interface PropertyUploadImageResponse {
  success: boolean;
  taskId: string;
  url: string;
}
export const PropertyUploadImageService = {
  /** Upload image for property owner */
  upload: (command: UploadImageCommand) =>
    apiClient
      .post<PropertyUploadImageResponse>('/api/property/uploadimage', command)
      .then(res => res.data),
}; 