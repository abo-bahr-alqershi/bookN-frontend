import axios from 'axios';
import type { ResultDto } from '../types/common.types';
import type { UploadImageCommand } from '../types/upload-image.types';

export const AdminUploadImageService = {
  /** Upload image for admin */
  upload: (command: UploadImageCommand) =>
    axios.post<ResultDto<string>>('/api/admin/uploadimage', command).then(res => res.data),
}; 