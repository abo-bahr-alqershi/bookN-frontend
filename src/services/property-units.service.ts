import axios from 'axios';
import type { ResultDto, PaginatedResult } from '../types/common.types';
import type {
  UnitDto,
  UnitDetailsDto,
  CreateUnitCommand,
  CreateUnitWithFieldValuesCommand,
  UpdateUnitCommand,
  DeleteUnitCommand,
  GetUnitByIdQuery,
  GetUnitsByPropertyQuery,
  GetUnitsByTypeQuery,
  GetUnitAvailabilityQuery,
  GetUnitForEditQuery,
  GetUnitImagesQuery,
  BulkUpdateUnitAvailabilityCommand,
  GetAvailableUnitsQuery,
  UpdateUnitAvailabilityCommand,
} from '../types/unit.types';

// خدمات الوحدات لأصحاب العقارات
const API_BASE = '/api/property/units';

export const PropertyUnitsService = {
  /** جلب بيانات وحدة بواسطة المعرف */
  getById: (query: GetUnitByIdQuery) =>
    axios.get<ResultDto<UnitDto>>(`${API_BASE}/${query.unitId}`).then(res => res.data),

  /** جلب الوحدات الخاصة بعقار */
  getByProperty: (query: GetUnitsByPropertyQuery) =>
    axios.get<PaginatedResult<UnitDto>>(`${API_BASE}/property/${query.propertyId}`, { params: { pageNumber: query.pageNumber, pageSize: query.pageSize } }).then(res => res.data),

  /** إنشاء وحدة جديدة */
  create: (data: CreateUnitCommand) =>
    axios.post<ResultDto<string>>(`${API_BASE}`, data).then(res => res.data),

  /** إنشاء وحدة مع قيم الحقول الديناميكية */
  createWithFieldValues: (data: CreateUnitWithFieldValuesCommand) =>
    axios.post<ResultDto<string>>(`${API_BASE}/with-field-values`, data).then(res => res.data),

  /** تحديث بيانات وحدة */
  update: (unitId: string, data: UpdateUnitCommand) =>
    axios.put<ResultDto<boolean>>(`${API_BASE}/${unitId}`, data).then(res => res.data),

  /** حذف وحدة */
  delete: (unitId: string) =>
    axios.delete<ResultDto<boolean>>(`${API_BASE}/${unitId}`).then(res => res.data),

  /** تحديث توفر وحدة */
  updateAvailability: (unitId: string, data: UpdateUnitAvailabilityCommand) =>
    axios.post<ResultDto<boolean>>(`${API_BASE}/${unitId}/availability`, data).then(res => res.data),

  /** تحديث متعدد لتوفر الوحدات */
  bulkUpdateAvailability: (data: BulkUpdateUnitAvailabilityCommand) =>
    axios.post<ResultDto<boolean>>(`${API_BASE}/bulk-availability`, data).then(res => res.data),

  /** جلب الوحدات المتاحة */
  getAvailable: (query: GetAvailableUnitsQuery) =>
    axios.get<PaginatedResult<UnitDto>>(`${API_BASE}/available`, { params: query }).then(res => res.data),

  /** جلب تفاصيل الوحدة */
  getDetails: (query: GetUnitAvailabilityQuery) =>
    axios.get<ResultDto<UnitDetailsDto>>(`${API_BASE}/${query.unitId}/details`, { params: { includeDynamicFields: true } }).then(res => res.data),

  /** جلب الوحدات حسب النوع مع إمكانية تضمين القيم الديناميكية */
  getByType: (query: GetUnitsByTypeQuery) => {
    const { unitTypeId, includeDynamicFields, pageNumber, pageSize, isAvailable, minBasePrice, maxBasePrice, minCapacity, nameContains } = query;
    return axios
      .get<PaginatedResult<UnitDto>>(
        `${API_BASE}/type/${unitTypeId}`,
        { params: { includeDynamicFields, pageNumber, pageSize, isAvailable, minBasePrice, maxBasePrice, minCapacity, nameContains } }
      )
      .then(res => res.data);
  },

  /** جلب توفر وحدة */
  getAvailability: (query: GetUnitAvailabilityQuery) =>
    axios.get<ResultDto<boolean>>(`${API_BASE}/${query.unitId}/availability`).then(res => res.data),

  /** جلب بيانات الوحدة للتعديل */
  getForEdit: (query: GetUnitForEditQuery) =>
    axios.get<ResultDto<UnitDto>>(`${API_BASE}/${query.unitId}/for-edit`).then(res => res.data),

  /** جلب صور الوحدة */
  getImages: (query: GetUnitImagesQuery) =>
    axios.get<ResultDto<any>>(`${API_BASE}/${query.unitId}/images`).then(res => res.data),
}; 