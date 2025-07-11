import axios from 'axios';
import type { ResultDto } from '../types/common.types';
import type { UploadImageCommand } from '../types/upload-image.types';

export const PropertyUploadImageService = {
  /** Upload image for property owner */
  upload: (command: UploadImageCommand) =>
    axios.post<ResultDto<string>>('/api/property/uploadimage', command).then(res => res.data),
}; 