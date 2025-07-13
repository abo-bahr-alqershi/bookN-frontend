import { useState } from 'react';
import { useAdminProperties } from '../../hooks/useAdminProperties';
import DataTable, { type Column } from '../../components/common/DataTable';
import SearchAndFilter, { type FilterOption } from '../../components/common/SearchAndFilter';
import Modal from '../../components/common/Modal';
import UserSelector from '../../components/selectors/UserSelector';
import LocationSelector from '../../components/selectors/LocationSelector';
import ImageUpload from '../../components/inputs/ImageUpload';
import type { 
  PropertyDto, 
  CreatePropertyCommand, 
  UpdatePropertyCommand, 
  GetAllPropertiesQuery 
} from '../../types/property.types';

const AdminProperties = () => {
  
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [filterValues, setFilterValues] = useState<Record<string, any>>({
    propertyTypeId: '',
    isApproved: undefined,
    starRatings: [],
    minPrice: '',
    maxPrice: '',
    hasActiveBookings: undefined,
  });

  // State for modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<PropertyDto | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // State for forms
  const [createForm, setCreateForm] = useState<CreatePropertyCommand>({
    name: '',
    address: '',
    propertyTypeId: '',
    ownerId: '',
    description: '',
    latitude: 0,
    longitude: 0,
    city: '',
    starRating: 3,
    images: [],
  });

  const [editForm, setEditForm] = useState<UpdatePropertyCommand>({
    propertyId: '',
    name: '',
    address: '',
    description: '',
    latitude: 0,
    longitude: 0,
    city: '',
    starRating: 3,
    images: [],
  });

  // Build query params
  const queryParams: GetAllPropertiesQuery = {
    pageNumber: currentPage,
    pageSize,
    searchTerm: searchTerm || undefined,
    propertyTypeId: filterValues.propertyTypeId || undefined,
    isApproved: filterValues.isApproved,
    starRatings: filterValues.starRatings.length > 0 ? filterValues.starRatings : undefined,
    minPrice: filterValues.minPrice || undefined,
    maxPrice: filterValues.maxPrice || undefined,
    hasActiveBookings: filterValues.hasActiveBookings,
  };

  // استخدام الهوك لإدارة بيانات العقارات والعمليات
  const {
    propertiesData,
    pendingPropertiesData,
    isLoading: isLoadingProperties,
    error: propertiesError,
    createProperty,
    updateProperty,
    approveProperty,
    rejectProperty,
    deleteProperty,
  } = useAdminProperties(queryParams);

  // تم حذف تعريفات الـ mutations المباشرة لاستخدام الهوك

  // Helper functions
  const resetCreateForm = () => {
    setCreateForm({
      name: '',
      address: '',
      propertyTypeId: '',
      ownerId: '',
      description: '',
      latitude: 0,
      longitude: 0,
      city: '',
      starRating: 3,
      images: [],
    });
  };

  const handleEdit = (property: PropertyDto) => {
    setSelectedProperty(property);
    setEditForm({
      propertyId: property.id,
      name: property.name,
      address: property.address,
      description: property.description,
      latitude: property.latitude,
      longitude: property.longitude,
      city: property.city,
      starRating: property.starRating,
      images: property.images || [],
    });
    setShowEditModal(true);
  };

  const handleViewDetails = (property: PropertyDto) => {
    setSelectedProperty(property);
    setShowDetailsModal(true);
  };

  const handleApprove = (property: PropertyDto) => {
    if (confirm(`هل أنت متأكد من الموافقة على العقار "${property.name}"؟`)) {
      approveProperty.mutate(property.id);
    }
  };

  const handleReject = (property: PropertyDto) => {
    if (confirm(`هل أنت متأكد من رفض العقار "${property.name}"؟`)) {
      rejectProperty.mutate(property.id);
    }
  };

  const handleDelete = (property: PropertyDto) => {
    if (confirm(`هل أنت متأكد من حذف العقار "${property.name}"؟ هذا الإجراء لا يمكن التراجع عنه.`)) {
      deleteProperty.mutate(property.id);
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilterValues(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilterValues({
      propertyTypeId: '',
      isApproved: undefined,
      starRatings: [],
      minPrice: '',
      maxPrice: '',
      hasActiveBookings: undefined,
    });
    setSearchTerm('');
    setCurrentPage(1);
  };

  // Filter options
  const filterOptions: FilterOption[] = [
    {
      key: 'propertyTypeId',
      label: 'نوع العقار',
      type: 'select',
      options: [
        { value: 'hotel', label: 'فندق' },
        { value: 'resort', label: 'منتجع' },
        { value: 'apartment', label: 'شقة مفروشة' },
        { value: 'villa', label: 'فيلا' },
      ],
    },
    {
      key: 'isApproved',
      label: 'حالة الموافقة',
      type: 'boolean',
    },
    {
      key: 'starRatings',
      label: 'تقييم النجوم',
      type: 'select',
      options: [
        { value: '5', label: '5 نجوم' },
        { value: '4', label: '4 نجوم' },
        { value: '3', label: '3 نجوم' },
        { value: '2', label: '2 نجوم' },
        { value: '1', label: '1 نجمة' },
      ],
    },
    {
      key: 'minPrice',
      label: 'الحد الأدنى للسعر',
      type: 'number',
      placeholder: 'أدخل الحد الأدنى',
    },
    {
      key: 'maxPrice',
      label: 'الحد الأقصى للسعر',
      type: 'number',
      placeholder: 'أدخل الحد الأقصى',
    },
    {
      key: 'hasActiveBookings',
      label: 'يحتوي على حجوزات نشطة',
      type: 'boolean',
    },
  ];

  // Table columns
  const columns: Column<PropertyDto>[] = [
    {
      key: 'name',
      title: 'اسم العقار',
      sortable: true,
      render: (value: string, record: PropertyDto) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{value}</span>
          <span className="text-sm text-gray-500">{record.typeName}</span>
        </div>
      ),
    },
    {
      key: 'ownerName',
      title: 'المالك',
      sortable: true,
    },
    {
      key: 'city',
      title: 'المدينة',
      sortable: true,
    },
    {
      key: 'starRating',
      title: 'تقييم النجوم',
      render: (value: number) => (
        <div className="flex items-center">
          <span className="ml-1">{value}</span>
          <span className="text-yellow-400">{'★'.repeat(value)}{'☆'.repeat(5 - value)}</span>
        </div>
      ),
    },
    {
      key: 'isApproved',
      title: 'حالة الموافقة',
      render: (value: boolean) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          value ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {value ? 'معتمد' : 'في انتظار الموافقة'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      title: 'تاريخ الإنشاء',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString('ar-SA'),
    },
  ];

  // Table actions
  const tableActions = [
    {
      label: 'عرض التفاصيل',
      icon: '👁️',
      color: 'blue' as const,
      onClick: handleViewDetails,
    },
    {
      label: 'تعديل',
      icon: '✏️',
      color: 'blue' as const,
      onClick: handleEdit,
    },
    {
      label: 'موافقة',
      icon: '✅',
      color: 'green' as const,
      onClick: handleApprove,
      show: (record: PropertyDto) => !record.isApproved,
    },
    {
      label: 'رفض',
      icon: '❌',
      color: 'red' as const,
      onClick: handleReject,
      show: (record: PropertyDto) => !record.isApproved,
    },
    {
      label: 'حذف',
      icon: '🗑️',
      color: 'red' as const,
      onClick: handleDelete,
    },
  ];

  if (propertiesError) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">خطأ في تحميل البيانات</h2>
        <p className="text-gray-600">حدث خطأ أثناء تحميل بيانات العقارات. يرجى المحاولة مرة أخرى.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">إدارة العقارات</h1>
            <p className="text-gray-600 mt-1">
              مراجعة وموافقة العقارات الجديدة وإدارة العقارات المسجلة
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              ➕ إضافة عقار جديد
            </button>
          </div>
        </div>
      </div>

      {/* Pending Properties Alert */}
      {pendingPropertiesData && pendingPropertiesData.totalCount > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-yellow-600 text-xl ml-3">⚠️</span>
            <div>
              <h3 className="text-sm font-medium text-yellow-800">
                عقارات في انتظار الموافقة
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                يوجد {pendingPropertiesData.totalCount} عقار في انتظار المراجعة والموافقة
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <SearchAndFilter
        searchPlaceholder="البحث في العقارات..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filterOptions}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        showAdvanced={showAdvancedFilters}
        onToggleAdvanced={() => setShowAdvancedFilters(!showAdvancedFilters)}
      />

      {/* Data Table */}
      <DataTable
        data={propertiesData?.items || []}
        columns={columns}
        loading={isLoadingProperties}
        pagination={{
          current: currentPage,
          total: propertiesData?.totalCount || 0,
          pageSize,
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          },
        }}
        rowSelection={{
          selectedRowKeys: selectedRows,
          onChange: setSelectedRows,
        }}
        actions={tableActions}
        onRowClick={handleViewDetails}
      />

      {/* Create Property Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="إضافة عقار جديد"
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              إلغاء
            </button>
            <button
              onClick={() => createProperty.mutate(createForm)}
              disabled={createProperty.status === 'pending'}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {createProperty.status === 'pending' ? 'جارٍ الإضافة...' : 'إضافة'}
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              اسم العقار *
            </label>
            <input
              type="text"
              value={createForm.name}
              onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="أدخل اسم العقار"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              نوع العقار *
            </label>
            <select
              value={createForm.propertyTypeId}
              onChange={(e) => setCreateForm(prev => ({ ...prev, propertyTypeId: e.target.value }))}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">اختر نوع العقار</option>
              <option value="hotel">فندق</option>
              <option value="resort">منتجع</option>
              <option value="apartment">شقة مفروشة</option>
              <option value="villa">فيلا</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              مالك العقار *
            </label>
            <UserSelector
              value={createForm.ownerId}
              onChange={(userId) => setCreateForm(prev => ({ ...prev, ownerId: userId }))}
              placeholder="اختر مالك العقار"
              allowedRoles={['Owner']}
              required={true}
              className=""
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              المدينة *
            </label>
            <input
              type="text"
              value={createForm.city}
              onChange={(e) => setCreateForm(prev => ({ ...prev, city: e.target.value }))}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="أدخل اسم المدينة"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              العنوان *
            </label>
            <input
              type="text"
              value={createForm.address}
              onChange={(e) => setCreateForm(prev => ({ ...prev, address: e.target.value }))}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="أدخل العنوان الكامل"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الموقع الجغرافي *
            </label>
            <LocationSelector
              latitude={createForm.latitude}
              longitude={createForm.longitude}
              onChange={(lat, lng, address) => {
                setCreateForm(prev => ({
                  ...prev,
                  latitude: lat,
                  longitude: lng
                }));
              }}
              placeholder="حدد موقع العقار"
              required={true}
              showMap={true}
              allowManualInput={true}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              تقييم النجوم
            </label>
            <select
              value={createForm.starRating}
              onChange={(e) => setCreateForm(prev => ({ ...prev, starRating: Number(e.target.value) }))}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value={1}>1 نجمة</option>
              <option value={2}>2 نجمة</option>
              <option value={3}>3 نجوم</option>
              <option value={4}>4 نجوم</option>
              <option value={5}>5 نجوم</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              وصف العقار
            </label>
            <textarea
              rows={3}
              value={createForm.description}
              onChange={(e) => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="أدخل وصف مفصل للعقار"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              صور العقار
            </label>
            <ImageUpload
              value={createForm.images || []}
              onChange={(urls) => setCreateForm(prev => ({ ...prev, images: Array.isArray(urls) ? urls : [urls] }))}
              multiple={true}
              maxFiles={10}
              maxSize={5}
              showPreview={true}
              placeholder="اضغط لرفع صور العقار أو اسحبها هنا"
              uploadEndpoint="/api/upload/property-images"
            />
          </div>
        </div>
      </Modal>

      {/* Edit Property Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedProperty(null);
        }}
        title="تعديل بيانات العقار"
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setShowEditModal(false);
                setSelectedProperty(null);
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              إلغاء
            </button>
            <button
              onClick={() => updateProperty.mutate({ 
                propertyId: editForm.propertyId, 
                data: editForm 
              })}
              disabled={updateProperty.status === 'pending'}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {updateProperty.status === 'pending' ? 'جارٍ التحديث...' : 'تحديث'}
            </button>
          </div>
        }
      >
        {selectedProperty && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                اسم العقار
              </label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                المدينة
              </label>
              <input
                type="text"
                value={editForm.city}
                onChange={(e) => setEditForm(prev => ({ ...prev, city: e.target.value }))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                العنوان
              </label>
              <input
                type="text"
                value={editForm.address}
                onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الموقع الجغرافي
              </label>
              <LocationSelector
                latitude={editForm.latitude || 0}
                longitude={editForm.longitude || 0}
                onChange={(lat, lng, address) => {
                  setEditForm(prev => ({
                    ...prev,
                    latitude: lat,
                    longitude: lng
                  }));
                }}
                placeholder="حدث موقع العقار"
                showMap={true}
                allowManualInput={true}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                تقييم النجوم
              </label>
              <select
                value={editForm.starRating}
                onChange={(e) => setEditForm(prev => ({ ...prev, starRating: Number(e.target.value) }))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value={1}>1 نجمة</option>
                <option value={2}>2 نجمة</option>
                <option value={3}>3 نجوم</option>
                <option value={4}>4 نجوم</option>
                <option value={5}>5 نجوم</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                وصف العقار
              </label>
              <textarea
                rows={3}
                value={editForm.description}
                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                صور العقار
              </label>
              <ImageUpload
                value={editForm.images || selectedProperty?.images || []}
                onChange={(urls) => setEditForm(prev => ({ ...prev, images: Array.isArray(urls) ? urls : [urls] }))}
                multiple={true}
                maxFiles={10}
                maxSize={5}
                showPreview={true}
                placeholder="اضغط لرفع صور جديدة أو اسحبها هنا"
                uploadEndpoint="/api/upload/property-images"
              />
            </div>
          </div>
        )}
      </Modal>

      {/* Property Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedProperty(null);
        }}
        title="تفاصيل العقار"
        size="xl"
      >
        {selectedProperty && (
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">اسم العقار</label>
                <p className="mt-1 text-sm text-gray-900">{selectedProperty.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">نوع العقار</label>
                <p className="mt-1 text-sm text-gray-900">{selectedProperty.typeName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">المالك</label>
                <p className="mt-1 text-sm text-gray-900">{selectedProperty.ownerName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">المدينة</label>
                <p className="mt-1 text-sm text-gray-900">{selectedProperty.city}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">تقييم النجوم</label>
                <div className="mt-1 flex items-center">
                  <span className="text-yellow-400">
                    {'★'.repeat(selectedProperty.starRating)}
                    {'☆'.repeat(5 - selectedProperty.starRating)}
                  </span>
                  <span className="mr-2 text-sm text-gray-600">
                    ({selectedProperty.starRating}/5)
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">حالة الموافقة</label>
                <span className={`mt-1 inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  selectedProperty.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {selectedProperty.isApproved ? 'معتمد' : 'في انتظار الموافقة'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">العنوان</label>
              <p className="mt-1 text-sm text-gray-900">{selectedProperty.address}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">الوصف</label>
              <p className="mt-1 text-sm text-gray-900">{selectedProperty.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">خط العرض</label>
                <p className="mt-1 text-sm text-gray-900">{selectedProperty.latitude}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">خط الطول</label>
                <p className="mt-1 text-sm text-gray-900">{selectedProperty.longitude}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">تاريخ الإنشاء</label>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(selectedProperty.createdAt).toLocaleString('ar-SA')}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminProperties;