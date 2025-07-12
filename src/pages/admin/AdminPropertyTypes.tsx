import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DataTable, { type Column } from '../../components/common/DataTable';
import SearchAndFilter, { type FilterOption } from '../../components/common/SearchAndFilter';
import Modal from '../../components/common/Modal';
import { AdminPropertyTypesService } from '../../services/admin-property-types.service';
import { AdminFieldTypesService } from '../../services/admin-field-types.service';
import { AdminUnitTypeFieldsService } from '../../services/admin-unit-type-fields.service';
import { AdminFieldGroupsService } from '../../services/admin-field-groups.service';
import type {
  PropertyTypeDto,
  CreatePropertyTypeCommand,
  UpdatePropertyTypeCommand,
  GetAllPropertyTypesQuery
} from '../../types/property-type.types';
import type {
  FieldTypeDto,
  CreateFieldTypeCommand,
  UpdateFieldTypeCommand
} from '../../types/field-type.types';
import type {
  UnitTypeFieldDto,
  CreateUnitTypeFieldCommand,
  UpdateUnitTypeFieldCommand,
  FieldGroupWithFieldsDto
} from '../../types/unit-type-field.types';
import type {
  FieldGroupDto,
  CreateFieldGroupCommand,
  UpdateFieldGroupCommand
} from '../../types/field-group.types';

const AdminPropertyTypes = () => {
  const queryClient = useQueryClient();
  
  // State for current view
  const [currentView, setCurrentView] = useState<'property-types' | 'field-types' | 'dynamic-fields'>('property-types');
  const [selectedPropertyType, setSelectedPropertyType] = useState<PropertyTypeDto | null>(null);
  
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  
  // State for modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showFieldsModal, setShowFieldsModal] = useState(false);
  const [showGroupsModal, setShowGroupsModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  
  // State for forms
  const [propertyTypeForm, setPropertyTypeForm] = useState<CreatePropertyTypeCommand>({
    name: '',
    description: '',
    defaultAmenities: '',
  });
  
  const [fieldTypeForm, setFieldTypeForm] = useState<CreateFieldTypeCommand>({
    name: '',
    displayName: '',
    validationRules: {},
    isActive: true,
  });
  
  const [dynamicFieldForm, setDynamicFieldForm] = useState<CreateUnitTypeFieldCommand>({
    propertyTypeId: '',
    fieldTypeId: '',
    fieldName: '',
    displayName: '',
    description: '',
    fieldOptions: {},
    validationRules: {},
    isRequired: false,
    isSearchable: false,
    isPublic: true,
    sortOrder: 0,
    category: '',
    isForUnits: true,
    groupId: '',
  });
  
  const [fieldGroupForm, setFieldGroupForm] = useState<CreateFieldGroupCommand>({
    propertyTypeId: '',
    groupName: '',
    displayName: '',
    description: '',
    sortOrder: 0,
    isCollapsible: true,
    isExpandedByDefault: true,
  });

  // Fetch property types
  const { data: propertyTypesData, isLoading: loadingPropertyTypes } = useQuery({
    queryKey: ['admin-property-types', currentPage, pageSize],
    queryFn: () => AdminPropertyTypesService.getAll({ pageNumber: currentPage, pageSize }),
  });

  // Fetch field types
  const { data: fieldTypesData, isLoading: loadingFieldTypes } = useQuery({
    queryKey: ['admin-field-types'],
    queryFn: () => AdminFieldTypesService.getAll(),
    enabled: currentView === 'field-types' || showFieldsModal,
  });

  // Fetch dynamic fields for selected property type
  const { data: dynamicFieldsData, isLoading: loadingDynamicFields } = useQuery({
    queryKey: ['admin-dynamic-fields', selectedPropertyType?.id],
    queryFn: () => selectedPropertyType ? AdminUnitTypeFieldsService.getByPropertyType({ propertyTypeId: selectedPropertyType.id }) : Promise.resolve([]),
    enabled: !!selectedPropertyType && (currentView === 'dynamic-fields' || showFieldsModal),
  });

  // Fetch field groups for selected property type
  const { data: fieldGroupsData, isLoading: loadingFieldGroups } = useQuery({
    queryKey: ['admin-field-groups', selectedPropertyType?.id],
    queryFn: () => selectedPropertyType ? AdminFieldGroupsService.getByPropertyType({ propertyTypeId: selectedPropertyType.id }) : Promise.resolve([]),
    enabled: !!selectedPropertyType && showGroupsModal,
  });

  // Mutations for property types
  const createPropertyTypeMutation = useMutation({
    mutationFn: AdminPropertyTypesService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-property-types'] });
      setShowCreateModal(false);
      resetPropertyTypeForm();
    },
  });

  const updatePropertyTypeMutation = useMutation({
    mutationFn: ({ propertyTypeId, data }: { propertyTypeId: string; data: UpdatePropertyTypeCommand }) =>
      AdminPropertyTypesService.update(propertyTypeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-property-types'] });
      setShowEditModal(false);
      setSelectedPropertyType(null);
    },
  });

  const deletePropertyTypeMutation = useMutation({
    mutationFn: AdminPropertyTypesService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-property-types'] });
    },
  });

  // Mutations for field types
  const createFieldTypeMutation = useMutation({
    mutationFn: AdminFieldTypesService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-field-types'] });
      resetFieldTypeForm();
    },
  });

  // Mutations for dynamic fields
  const createDynamicFieldMutation = useMutation({
    mutationFn: AdminUnitTypeFieldsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dynamic-fields'] });
      resetDynamicFieldForm();
    },
  });

  // Mutations for field groups
  const createFieldGroupMutation = useMutation({
    mutationFn: AdminFieldGroupsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-field-groups'] });
      resetFieldGroupForm();
    },
  });

  // Helper functions
  const resetPropertyTypeForm = () => {
    setPropertyTypeForm({
      name: '',
      description: '',
      defaultAmenities: '',
    });
  };

  const resetFieldTypeForm = () => {
    setFieldTypeForm({
      name: '',
      displayName: '',
      validationRules: {},
      isActive: true,
    });
  };

  const resetDynamicFieldForm = () => {
    setDynamicFieldForm({
      propertyTypeId: selectedPropertyType?.id || '',
      fieldTypeId: '',
      fieldName: '',
      displayName: '',
      description: '',
      fieldOptions: {},
      validationRules: {},
      isRequired: false,
      isSearchable: false,
      isPublic: true,
      sortOrder: 0,
      category: '',
      isForUnits: true,
      groupId: '',
    });
  };

  const resetFieldGroupForm = () => {
    setFieldGroupForm({
      propertyTypeId: selectedPropertyType?.id || '',
      groupName: '',
      displayName: '',
      description: '',
      sortOrder: 0,
      isCollapsible: true,
      isExpandedByDefault: true,
    });
  };

  const handleManageFields = (propertyType: PropertyTypeDto) => {
    setSelectedPropertyType(propertyType);
    setCurrentView('dynamic-fields');
  };

  const handleViewDetails = (propertyType: PropertyTypeDto) => {
    setSelectedPropertyType(propertyType);
    setShowDetailsModal(true);
  };

  const handleEdit = (propertyType: PropertyTypeDto) => {
    setSelectedPropertyType(propertyType);
    setPropertyTypeForm({
      name: propertyType.name,
      description: propertyType.description,
      defaultAmenities: propertyType.defaultAmenities,
    });
    setShowEditModal(true);
  };

  const handleDelete = (propertyType: PropertyTypeDto) => {
    if (confirm(`هل أنت متأكد من حذف نوع العقار "${propertyType.name}"؟ هذا الإجراء لا يمكن التراجع عنه.`)) {
      deletePropertyTypeMutation.mutate(propertyType.id);
    }
  };

  // Statistics calculation
  const stats = {
    propertyTypes: propertyTypesData?.totalCount || 0,
    fieldTypes: fieldTypesData?.data?.length || 0,
    dynamicFields: dynamicFieldsData?.length || 0,
    activeFieldTypes: fieldTypesData?.data?.filter(ft => ft.isActive).length || 0,
  };

  // Property Types columns
  const propertyTypeColumns: Column<PropertyTypeDto>[] = [
    {
      key: 'name',
      title: 'اسم النوع',
      sortable: true,
      render: (value: string, record: PropertyTypeDto) => (
        <div className="flex items-center">
          <span className="text-2xl ml-3">🏗️</span>
          <div>
            <span className="font-medium text-gray-900">{value}</span>
            <p className="text-sm text-gray-500 mt-1">{record.description}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'id',
      title: 'المعرف',
      render: (value: string) => (
        <span className="font-mono text-sm text-gray-600">
          {value.substring(0, 8)}...
        </span>
      ),
    },
    {
      key: 'defaultAmenities',
      title: 'المرافق الافتراضية',
      render: (value: string) => (
        <div className="max-w-xs">
          <p className="text-sm text-gray-700 truncate" title={value}>
            {value || 'لا توجد مرافق افتراضية'}
          </p>
        </div>
      ),
    },
  ];

  // Property Types actions
  const propertyTypeActions = [
    {
      label: 'عرض التفاصيل',
      icon: '👁️',
      color: 'blue' as const,
      onClick: handleViewDetails,
    },
    {
      label: 'إدارة الحقول',
      icon: '⚙️',
      color: 'green' as const,
      onClick: handleManageFields,
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

  // Field Types columns
  const fieldTypeColumns: Column<FieldTypeDto>[] = [
    {
      key: 'displayName',
      title: 'اسم النوع',
      sortable: true,
      render: (value: string, record: FieldTypeDto) => (
        <div className="flex items-center">
          <span className="text-2xl ml-3">🔧</span>
          <div>
            <span className="font-medium text-gray-900">{value}</span>
            <p className="text-sm text-gray-500 mt-1">{record.name}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'isActive',
      title: 'الحالة',
      render: (value: boolean) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value ? 'مفعل' : 'غير مفعل'}
        </span>
      ),
    },
  ];

  // Dynamic Fields columns
  const dynamicFieldColumns: Column<UnitTypeFieldDto>[] = [
    {
      key: 'displayName',
      title: 'اسم الحقل',
      sortable: true,
      render: (value: string, record: UnitTypeFieldDto) => (
        <div className="flex items-center">
          <span className="text-2xl ml-3">📝</span>
          <div>
            <span className="font-medium text-gray-900">{value}</span>
            <p className="text-sm text-gray-500 mt-1">{record.fieldName}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'isRequired',
      title: 'إلزامي',
      render: (value: boolean) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          value ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {value ? 'إلزامي' : 'اختياري'}
        </span>
      ),
    },
    {
      key: 'isPublic',
      title: 'عام',
      render: (value: boolean) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          value ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {value ? 'عام' : 'خاص'}
        </span>
      ),
    },
    {
      key: 'sortOrder',
      title: 'الترتيب',
      render: (value: number) => (
        <span className="text-sm text-gray-600">{value}</span>
      ),
    },
  ];

  const renderPropertyTypesView = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">إدارة أنواع العقارات</h1>
            <p className="text-gray-600 mt-1">
              إدارة تصنيفات العقارات والحقول الديناميكية المخصصة لكل نوع
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentView('field-types')}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              أنواع الحقول
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              ➕ إضافة نوع جديد
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-lg">
              <span className="text-2xl">🏗️</span>
            </div>
            <div className="mr-3">
              <p className="text-sm font-medium text-gray-600">أنواع العقارات</p>
              <p className="text-2xl font-bold text-gray-900">{stats.propertyTypes}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="bg-green-100 p-2 rounded-lg">
              <span className="text-2xl">🔧</span>
            </div>
            <div className="mr-3">
              <p className="text-sm font-medium text-gray-600">أنواع الحقول</p>
              <p className="text-2xl font-bold text-green-600">{stats.fieldTypes}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="bg-purple-100 p-2 rounded-lg">
              <span className="text-2xl">📝</span>
            </div>
            <div className="mr-3">
              <p className="text-sm font-medium text-gray-600">الحقول الديناميكية</p>
              <p className="text-2xl font-bold text-purple-600">{stats.dynamicFields}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <span className="text-2xl">✅</span>
            </div>
            <div className="mr-3">
              <p className="text-sm font-medium text-gray-600">حقول مفعلة</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.activeFieldTypes}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Property Types Table */}
      <DataTable
        data={propertyTypesData?.items || []}
        columns={propertyTypeColumns}
        loading={loadingPropertyTypes}
        pagination={{
          current: currentPage,
          total: propertyTypesData?.totalCount || 0,
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
        actions={propertyTypeActions}
        onRowClick={handleViewDetails}
      />
    </div>
  );

  const renderFieldTypesView = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">إدارة أنواع الحقول</h1>
            <p className="text-gray-600 mt-1">
              إدارة أنواع الحقول المتاحة للاستخدام في الحقول الديناميكية
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentView('property-types')}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              ← العودة لأنواع العقارات
            </button>
            <button
              onClick={() => {
                resetFieldTypeForm();
                setShowCreateModal(true);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              ➕ إضافة نوع حقل
            </button>
          </div>
        </div>
      </div>

      {/* Field Types Table */}
      <DataTable
        data={fieldTypesData?.data || []}
        columns={fieldTypeColumns}
        loading={loadingFieldTypes}
      />
    </div>
  );

  const renderDynamicFieldsView = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              الحقول الديناميكية - {selectedPropertyType?.name}
            </h1>
            <p className="text-gray-600 mt-1">
              إدارة الحقول الديناميكية المخصصة لنوع العقار المحدد
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentView('property-types')}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              ← العودة لأنواع العقارات
            </button>
            <button
              onClick={() => setShowGroupsModal(true)}
              className="px-4 py-2 border border-purple-300 text-purple-700 rounded-md hover:bg-purple-50"
            >
              📁 إدارة المجموعات
            </button>
            <button
              onClick={() => {
                resetDynamicFieldForm();
                setShowFieldsModal(true);
              }}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              ➕ إضافة حقل ديناميكي
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Fields Table */}
      <DataTable
        data={dynamicFieldsData || []}
        columns={dynamicFieldColumns}
        loading={loadingDynamicFields}
      />
    </div>
  );

  return (
    <div className="space-y-6">
      {currentView === 'property-types' && renderPropertyTypesView()}
      {currentView === 'field-types' && renderFieldTypesView()}
      {currentView === 'dynamic-fields' && renderDynamicFieldsView()}

      {/* Create/Edit Property Type Modal */}
      {currentView === 'property-types' && (
        <Modal
          isOpen={showCreateModal || showEditModal}
          onClose={() => {
            setShowCreateModal(false);
            setShowEditModal(false);
            setSelectedPropertyType(null);
            resetPropertyTypeForm();
          }}
          title={showEditModal ? 'تعديل نوع العقار' : 'إضافة نوع عقار جديد'}
          size="lg"
          footer={
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setShowEditModal(false);
                  setSelectedPropertyType(null);
                  resetPropertyTypeForm();
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  if (showEditModal && selectedPropertyType) {
                    updatePropertyTypeMutation.mutate({
                      propertyTypeId: selectedPropertyType.id,
                      data: {
                        propertyTypeId: selectedPropertyType.id,
                        ...propertyTypeForm,
                      },
                    });
                  } else {
                    createPropertyTypeMutation.mutate(propertyTypeForm);
                  }
                }}
                disabled={createPropertyTypeMutation.isPending || updatePropertyTypeMutation.isPending || !propertyTypeForm.name.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {(createPropertyTypeMutation.isPending || updatePropertyTypeMutation.isPending) 
                  ? 'جارٍ الحفظ...' 
                  : showEditModal ? 'تحديث' : 'إضافة'
                }
              </button>
            </div>
          }
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                اسم نوع العقار *
              </label>
              <input
                type="text"
                value={propertyTypeForm.name}
                onChange={(e) => setPropertyTypeForm(prev => ({ ...prev, name: e.target.value }))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="أدخل اسم نوع العقار"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                وصف نوع العقار *
              </label>
              <textarea
                rows={3}
                value={propertyTypeForm.description}
                onChange={(e) => setPropertyTypeForm(prev => ({ ...prev, description: e.target.value }))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="أدخل وصف تفصيلي لنوع العقار"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                المرافق الافتراضية
              </label>
              <textarea
                rows={2}
                value={propertyTypeForm.defaultAmenities}
                onChange={(e) => setPropertyTypeForm(prev => ({ ...prev, defaultAmenities: e.target.value }))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="قائمة المرافق الافتراضية (فصل بفواصل)"
              />
            </div>
          </div>
        </Modal>
      )}

      {/* Create Field Type Modal */}
      {currentView === 'field-types' && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            resetFieldTypeForm();
          }}
          title="إضافة نوع حقل جديد"
          size="lg"
          footer={
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetFieldTypeForm();
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                إلغاء
              </button>
              <button
                onClick={() => createFieldTypeMutation.mutate(fieldTypeForm)}
                disabled={createFieldTypeMutation.isPending || !fieldTypeForm.name.trim()}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {createFieldTypeMutation.isPending ? 'جارٍ الإضافة...' : 'إضافة'}
              </button>
            </div>
          }
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                اسم النوع (تقني) *
              </label>
              <input
                type="text"
                value={fieldTypeForm.name}
                onChange={(e) => setFieldTypeForm(prev => ({ ...prev, name: e.target.value }))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="text, number, date, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الاسم المعروض *
              </label>
              <input
                type="text"
                value={fieldTypeForm.displayName}
                onChange={(e) => setFieldTypeForm(prev => ({ ...prev, displayName: e.target.value }))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="نص، رقم، تاريخ، إلخ"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={fieldTypeForm.isActive}
                onChange={(e) => setFieldTypeForm(prev => ({ ...prev, isActive: e.target.checked }))}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="mr-2 block text-sm text-gray-900">
                مفعل
              </label>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Dynamic Field Modal */}
      <Modal
        isOpen={showFieldsModal}
        onClose={() => {
          setShowFieldsModal(false);
          resetDynamicFieldForm();
        }}
        title="إضافة حقل ديناميكي جديد"
        size="xl"
        footer={
          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setShowFieldsModal(false);
                resetDynamicFieldForm();
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              إلغاء
            </button>
            <button
              onClick={() => createDynamicFieldMutation.mutate(dynamicFieldForm)}
              disabled={createDynamicFieldMutation.isPending || !dynamicFieldForm.fieldName.trim()}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
            >
              {createDynamicFieldMutation.isPending ? 'جارٍ الإضافة...' : 'إضافة'}
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                اسم الحقل *
              </label>
              <input
                type="text"
                value={dynamicFieldForm.fieldName}
                onChange={(e) => setDynamicFieldForm(prev => ({ ...prev, fieldName: e.target.value }))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="اسم الحقل التقني"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الاسم المعروض *
              </label>
              <input
                type="text"
                value={dynamicFieldForm.displayName}
                onChange={(e) => setDynamicFieldForm(prev => ({ ...prev, displayName: e.target.value }))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="الاسم الذي سيظهر للمستخدم"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              نوع الحقل *
            </label>
            <select
              value={dynamicFieldForm.fieldTypeId}
              onChange={(e) => setDynamicFieldForm(prev => ({ ...prev, fieldTypeId: e.target.value }))}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">اختر نوع الحقل</option>
              {fieldTypesData?.data?.filter(ft => ft.isActive).map(fieldType => (
                <option key={fieldType.fieldTypeId} value={fieldType.fieldTypeId}>
                  {fieldType.displayName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              وصف الحقل
            </label>
            <textarea
              rows={2}
              value={dynamicFieldForm.description}
              onChange={(e) => setDynamicFieldForm(prev => ({ ...prev, description: e.target.value }))}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="وصف تفصيلي للحقل"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ترتيب الحقل
              </label>
              <input
                type="number"
                value={dynamicFieldForm.sortOrder}
                onChange={(e) => setDynamicFieldForm(prev => ({ ...prev, sortOrder: Number(e.target.value) }))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                فئة الحقل
              </label>
              <input
                type="text"
                value={dynamicFieldForm.category}
                onChange={(e) => setDynamicFieldForm(prev => ({ ...prev, category: e.target.value }))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="مثل: معلومات أساسية، تفاصيل إضافية"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isRequired"
                checked={dynamicFieldForm.isRequired}
                onChange={(e) => setDynamicFieldForm(prev => ({ ...prev, isRequired: e.target.checked }))}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="isRequired" className="mr-2 block text-sm text-gray-900">
                إلزامي
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isSearchable"
                checked={dynamicFieldForm.isSearchable}
                onChange={(e) => setDynamicFieldForm(prev => ({ ...prev, isSearchable: e.target.checked }))}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="isSearchable" className="mr-2 block text-sm text-gray-900">
                قابل للبحث
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublic"
                checked={dynamicFieldForm.isPublic}
                onChange={(e) => setDynamicFieldForm(prev => ({ ...prev, isPublic: e.target.checked }))}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="isPublic" className="mr-2 block text-sm text-gray-900">
                عام
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isForUnits"
                checked={dynamicFieldForm.isForUnits}
                onChange={(e) => setDynamicFieldForm(prev => ({ ...prev, isForUnits: e.target.checked }))}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="isForUnits" className="mr-2 block text-sm text-gray-900">
                للوحدات
              </label>
            </div>
          </div>
        </div>
      </Modal>

      {/* Property Type Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedPropertyType(null);
        }}
        title="تفاصيل نوع العقار"
        size="lg"
      >
        {selectedPropertyType && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {selectedPropertyType.name}
              </h3>
              <p className="text-gray-700">{selectedPropertyType.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">معرف النوع</label>
                <p className="mt-1 text-sm text-gray-900 font-mono">{selectedPropertyType.id}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">المرافق الافتراضية</label>
              <div className="mt-1 p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-900">
                  {selectedPropertyType.defaultAmenities || 'لا توجد مرافق افتراضية محددة'}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminPropertyTypes;