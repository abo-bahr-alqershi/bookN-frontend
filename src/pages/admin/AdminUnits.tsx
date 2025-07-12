import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DataTable, { type Column } from '../../components/common/DataTable';
import CardView from '../../components/common/CardView';
import MapView from '../../components/common/MapView';
import SearchAndFilter, { type FilterOption } from '../../components/common/SearchAndFilter';
import ViewToggle, { type ViewType } from '../../components/common/ViewToggle';
import Modal from '../../components/common/Modal';
import { AdminUnitsService } from '../../services/admin-units.service';
import type { 
  UnitDto, 
  CreateUnitCommand, 
  UpdateUnitCommand,
  MoneyDto,
  PricingMethod
} from '../../types/unit.types';

// Extend UnitDto to include coordinates for map view
interface UnitWithLocation extends UnitDto {
  latitude?: number;
  longitude?: number;
  address?: string;
}

const AdminUnits = () => {
  const queryClient = useQueryClient();
  
  // State for view and search
  const [currentView, setCurrentView] = useState<ViewType>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [filterValues, setFilterValues] = useState<Record<string, any>>({
    propertyId: '',
    unitTypeId: '',
    isAvailable: undefined,
    minBasePrice: '',
    maxBasePrice: '',
    pricingMethod: '',
  });

  // State for modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<UnitDto | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // State for forms
  const [createForm, setCreateForm] = useState<CreateUnitCommand>({
    propertyId: '',
    unitTypeId: '',
    name: '',
    basePrice: { amount: 0, currency: 'SAR' },
    customFeatures: '',
    pricingMethod: 'Daily' as PricingMethod,
  });

  const [editForm, setEditForm] = useState<UpdateUnitCommand>({
    unitId: '',
    name: '',
    basePrice: { amount: 0, currency: 'SAR' },
    customFeatures: '',
    pricingMethod: 'Daily' as PricingMethod,
  });

  // Build query params
  const queryParams = {
    pageNumber: currentPage,
    pageSize,
    nameContains: searchTerm || undefined,
    propertyId: filterValues.propertyId || undefined,
    unitTypeId: filterValues.unitTypeId || undefined,
    isAvailable: filterValues.isAvailable,
    minBasePrice: filterValues.minBasePrice || undefined,
    maxBasePrice: filterValues.maxBasePrice || undefined,
  };

  // Fetch units
  const { data: unitsData, isLoading, error } = useQuery({
    queryKey: ['admin-units', queryParams],
    queryFn: () => AdminUnitsService.getAll(queryParams),
  });

  // Mutations
  const createUnitMutation = useMutation({
    mutationFn: AdminUnitsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-units'] });
      setShowCreateModal(false);
      resetCreateForm();
    },
  });

  const updateUnitMutation = useMutation({
    mutationFn: ({ unitId, data }: { unitId: string; data: UpdateUnitCommand }) =>
      AdminUnitsService.update(unitId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-units'] });
      setShowEditModal(false);
      setSelectedUnit(null);
    },
  });

  const deleteUnitMutation = useMutation({
    mutationFn: AdminUnitsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-units'] });
    },
  });

  // Helper functions
  const resetCreateForm = () => {
    setCreateForm({
      propertyId: '',
      unitTypeId: '',
      name: '',
      basePrice: { amount: 0, currency: 'SAR' },
      customFeatures: '',
      pricingMethod: 'Daily' as PricingMethod,
    });
  };

  const handleEdit = (unit: UnitDto) => {
    setSelectedUnit(unit);
    setEditForm({
      unitId: unit.id,
      name: unit.name,
      basePrice: unit.basePrice,
      customFeatures: unit.customFeatures,
      pricingMethod: unit.pricingMethod,
    });
    setShowEditModal(true);
  };

  const handleViewDetails = (unit: UnitDto) => {
    setSelectedUnit(unit);
    setShowDetailsModal(true);
  };

  const handleDelete = (unit: UnitDto) => {
    if (confirm(`هل أنت متأكد من حذف الوحدة "${unit.name}"؟ هذا الإجراء لا يمكن التراجع عنه.`)) {
      deleteUnitMutation.mutate(unit.id);
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilterValues(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilterValues({
      propertyId: '',
      unitTypeId: '',
      isAvailable: undefined,
      minBasePrice: '',
      maxBasePrice: '',
      pricingMethod: '',
    });
    setSearchTerm('');
    setCurrentPage(1);
  };

  // Filter options
  const filterOptions: FilterOption[] = [
    {
      key: 'propertyId',
      label: 'العقار',
      type: 'text',
      placeholder: 'أدخل معرف العقار',
    },
    {
      key: 'unitTypeId',
      label: 'نوع الوحدة',
      type: 'select',
      options: [
        { value: 'standard', label: 'قياسي' },
        { value: 'deluxe', label: 'فاخر' },
        { value: 'suite', label: 'جناح' },
        { value: 'villa', label: 'فيلا' },
      ],
    },
    {
      key: 'isAvailable',
      label: 'متاحة',
      type: 'boolean',
    },
    {
      key: 'minBasePrice',
      label: 'الحد الأدنى للسعر',
      type: 'number',
      placeholder: 'أدخل الحد الأدنى',
    },
    {
      key: 'maxBasePrice',
      label: 'الحد الأقصى للسعر',
      type: 'number',
      placeholder: 'أدخل الحد الأقصى',
    },
    {
      key: 'pricingMethod',
      label: 'طريقة التسعير',
      type: 'select',
      options: [
        { value: 'Hourly', label: 'بالساعة' },
        { value: 'Daily', label: 'يومي' },
        { value: 'Weekly', label: 'أسبوعي' },
        { value: 'Monthly', label: 'شهري' },
      ],
    },
  ];

  // Table columns
  const columns: Column<UnitDto>[] = [
    {
      key: 'name',
      title: 'اسم الوحدة',
      sortable: true,
      render: (value: string, record: UnitDto) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{value}</span>
          <span className="text-sm text-gray-500">{record.unitTypeName}</span>
        </div>
      ),
    },
    {
      key: 'propertyName',
      title: 'العقار',
      sortable: true,
    },
    {
      key: 'basePrice',
      title: 'السعر الأساسي',
      render: (value: MoneyDto) => (
        <div className="text-right">
          <span className="font-medium">{value.amount}</span>
          <span className="text-sm text-gray-500 mr-1">{value.currency}</span>
        </div>
      ),
    },
    {
      key: 'pricingMethod',
      title: 'طريقة التسعير',
      render: (value: PricingMethod) => {
        const methodLabels = {
          Hourly: 'بالساعة',
          Daily: 'يومي',
          Weekly: 'أسبوعي',
          Monthly: 'شهري',
        };
        return methodLabels[value] || value;
      },
    },
    {
      key: 'isAvailable',
      title: 'متاحة',
      render: (value: boolean) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value ? 'متاحة' : 'غير متاحة'}
        </span>
      ),
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
      label: 'حذف',
      icon: '🗑️',
      color: 'red' as const,
      onClick: handleDelete,
    },
  ];

  // Card renderer for card view
  const renderUnitCard = (unit: UnitDto) => (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{unit.name}</h3>
            <p className="text-sm text-gray-600">{unit.unitTypeName}</p>
          </div>
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
            unit.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {unit.isAvailable ? 'متاحة' : 'غير متاحة'}
          </span>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">العقار:</span>
            <span className="text-sm text-gray-900">{unit.propertyName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">السعر:</span>
            <span className="text-sm text-gray-900 font-medium">
              {unit.basePrice.amount} {unit.basePrice.currency}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">طريقة التسعير:</span>
            <span className="text-sm text-gray-900">
              {filterOptions.find(opt => opt.key === 'pricingMethod')?.options?.find(
                option => option.value === unit.pricingMethod
              )?.label || unit.pricingMethod}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handleViewDetails(unit)}
            className="flex-1 px-3 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded hover:bg-blue-100 transition-colors"
          >
            عرض التفاصيل
          </button>
          <button
            onClick={() => handleEdit(unit)}
            className="px-3 py-2 bg-gray-50 text-gray-700 text-sm font-medium rounded hover:bg-gray-100 transition-colors"
          >
            ✏️
          </button>
          <button
            onClick={() => handleDelete(unit)}
            className="px-3 py-2 bg-red-50 text-red-700 text-sm font-medium rounded hover:bg-red-100 transition-colors"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );

  // Transform units data for map view
  const unitsWithLocation: UnitWithLocation[] = (unitsData?.items || []).map(unit => ({
    ...unit,
    // In a real implementation, you would get coordinates from the property or unit data
    latitude: 24.7136 + (Math.random() - 0.5) * 0.1, // Mock coordinates around Riyadh
    longitude: 46.6753 + (Math.random() - 0.5) * 0.1,
    address: unit.propertyName, // Use property name as address
  }));

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">خطأ في تحميل البيانات</h2>
        <p className="text-gray-600">حدث خطأ أثناء تحميل بيانات الوحدات. يرجى المحاولة مرة أخرى.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">إدارة الوحدات</h1>
            <p className="text-gray-600 mt-1">
              إدارة جميع الوحدات في النظام مع 3 طرق عرض مختلفة
            </p>
          </div>
          <div className="flex gap-3">
            <ViewToggle
              currentView={currentView}
              onViewChange={setCurrentView}
              availableViews={['table', 'cards', 'map']}
            />
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              ➕ إضافة وحدة جديدة
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <SearchAndFilter
        searchPlaceholder="البحث في الوحدات..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filterOptions}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        showAdvanced={showAdvancedFilters}
        onToggleAdvanced={() => setShowAdvancedFilters(!showAdvancedFilters)}
      />

      {/* Data Views */}
      {currentView === 'table' && (
        <DataTable
          data={unitsData?.items || []}
          columns={columns}
          loading={isLoading}
          pagination={{
            current: currentPage,
            total: unitsData?.totalCount || 0,
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
      )}

      {currentView === 'cards' && (
        <CardView
          data={unitsData?.items || []}
          loading={isLoading}
          renderCard={renderUnitCard}
          emptyMessage="لا توجد وحدات للعرض"
          emptyIcon="🏠"
          columns={3}
        />
      )}

      {currentView === 'map' && (
        <MapView
          data={unitsWithLocation}
          loading={isLoading}
          onItemClick={handleViewDetails}
          renderPopup={(unit) => (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">النوع:</span>
                <span className="text-xs">{unit.unitTypeName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">السعر:</span>
                <span className="text-xs font-medium">
                  {unit.basePrice.amount} {unit.basePrice.currency}
                </span>
              </div>
              <button
                onClick={() => handleViewDetails(unit)}
                className="w-full mt-2 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
              >
                عرض التفاصيل
              </button>
            </div>
          )}
          emptyMessage="لا توجد وحدات بمواقع محددة لعرضها على الخريطة"
        />
      )}

      {/* Create Unit Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="إضافة وحدة جديدة"
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
              onClick={() => createUnitMutation.mutate(createForm)}
              disabled={createUnitMutation.isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {createUnitMutation.isPending ? 'جارٍ الإضافة...' : 'إضافة'}
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              معرف العقار *
            </label>
            <input
              type="text"
              value={createForm.propertyId}
              onChange={(e) => setCreateForm(prev => ({ ...prev, propertyId: e.target.value }))}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="أدخل معرف العقار"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              نوع الوحدة *
            </label>
            <select
              value={createForm.unitTypeId}
              onChange={(e) => setCreateForm(prev => ({ ...prev, unitTypeId: e.target.value }))}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">اختر نوع الوحدة</option>
              <option value="standard">قياسي</option>
              <option value="deluxe">فاخر</option>
              <option value="suite">جناح</option>
              <option value="villa">فيلا</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              اسم الوحدة *
            </label>
            <input
              type="text"
              value={createForm.name}
              onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="أدخل اسم الوحدة"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              السعر الأساسي *
            </label>
            <input
              type="number"
              value={createForm.basePrice.amount}
              onChange={(e) => setCreateForm(prev => ({ 
                ...prev, 
                basePrice: { ...prev.basePrice, amount: Number(e.target.value) }
              }))}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              طريقة التسعير *
            </label>
            <select
              value={createForm.pricingMethod}
              onChange={(e) => setCreateForm(prev => ({ ...prev, pricingMethod: e.target.value as PricingMethod }))}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="Hourly">بالساعة</option>
              <option value="Daily">يومي</option>
              <option value="Weekly">أسبوعي</option>
              <option value="Monthly">شهري</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الميزات المخصصة
            </label>
            <textarea
              rows={3}
              value={createForm.customFeatures}
              onChange={(e) => setCreateForm(prev => ({ ...prev, customFeatures: e.target.value }))}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="أدخل الميزات المخصصة للوحدة"
            />
          </div>
        </div>
      </Modal>

      {/* Edit Unit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedUnit(null);
        }}
        title="تعديل بيانات الوحدة"
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setShowEditModal(false);
                setSelectedUnit(null);
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              إلغاء
            </button>
            <button
              onClick={() => updateUnitMutation.mutate({ 
                unitId: editForm.unitId, 
                data: editForm 
              })}
              disabled={updateUnitMutation.isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {updateUnitMutation.isPending ? 'جارٍ التحديث...' : 'تحديث'}
            </button>
          </div>
        }
      >
        {selectedUnit && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                اسم الوحدة
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
                السعر الأساسي
              </label>
              <input
                type="number"
                value={editForm.basePrice?.amount || 0}
                onChange={(e) => setEditForm(prev => ({ 
                  ...prev, 
                  basePrice: { ...prev.basePrice!, amount: Number(e.target.value) }
                }))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                طريقة التسعير
              </label>
              <select
                value={editForm.pricingMethod}
                onChange={(e) => setEditForm(prev => ({ ...prev, pricingMethod: e.target.value as PricingMethod }))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="Hourly">بالساعة</option>
                <option value="Daily">يومي</option>
                <option value="Weekly">أسبوعي</option>
                <option value="Monthly">شهري</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الميزات المخصصة
              </label>
              <textarea
                rows={3}
                value={editForm.customFeatures}
                onChange={(e) => setEditForm(prev => ({ ...prev, customFeatures: e.target.value }))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
      </Modal>

      {/* Unit Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedUnit(null);
        }}
        title="تفاصيل الوحدة"
        size="xl"
      >
        {selectedUnit && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">اسم الوحدة</label>
                <p className="mt-1 text-sm text-gray-900">{selectedUnit.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">نوع الوحدة</label>
                <p className="mt-1 text-sm text-gray-900">{selectedUnit.unitTypeName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">العقار</label>
                <p className="mt-1 text-sm text-gray-900">{selectedUnit.propertyName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">السعر الأساسي</label>
                <p className="mt-1 text-sm text-gray-900 font-medium">
                  {selectedUnit.basePrice.amount} {selectedUnit.basePrice.currency}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">طريقة التسعير</label>
                <p className="mt-1 text-sm text-gray-900">
                  {filterOptions.find(opt => opt.key === 'pricingMethod')?.options?.find(
                    option => option.value === selectedUnit.pricingMethod
                  )?.label || selectedUnit.pricingMethod}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">حالة التوفر</label>
                <span className={`mt-1 inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  selectedUnit.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {selectedUnit.isAvailable ? 'متاحة' : 'غير متاحة'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">الميزات المخصصة</label>
              <p className="mt-1 text-sm text-gray-900">
                {selectedUnit.customFeatures || 'لا توجد ميزات مخصصة'}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminUnits;