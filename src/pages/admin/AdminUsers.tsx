import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DataTable, { type Column } from '../../components/common/DataTable';
import SearchAndFilter, { type FilterOption } from '../../components/common/SearchAndFilter';
import Modal from '../../components/common/Modal';
import { AdminUsersService } from '../../services/admin-users.service';
import type { UserDto, CreateUserCommand, UpdateUserCommand, GetAllUsersQuery } from '../../types/user.types';
import type { UserRole } from '../../types/role.types';

const AdminUsers = () => {
  const queryClient = useQueryClient();
  
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [filterValues, setFilterValues] = useState<Record<string, any>>({
    roleId: '',
    isActive: undefined,
    createdAfter: '',
    createdBefore: '',
  });

  // State for modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // State for forms
  const [createForm, setCreateForm] = useState<CreateUserCommand>({
    name: '',
    email: '',
    password: '',
    phone: '',
    profileImage: '',
  });

  const [editForm, setEditForm] = useState<UpdateUserCommand>({
    userId: '',
    name: '',
    email: '',
    phone: '',
    profileImage: '',
  });

  // Build query params
  const queryParams: GetAllUsersQuery = {
    pageNumber: currentPage,
    pageSize,
    searchTerm: searchTerm || undefined,
    roleId: filterValues.roleId || undefined,
    isActive: filterValues.isActive,
    createdAfter: filterValues.createdAfter || undefined,
    createdBefore: filterValues.createdBefore || undefined,
  };

  // Fetch users
  const { data: usersData, isLoading, error } = useQuery({
    queryKey: ['admin-users', queryParams],
    queryFn: () => AdminUsersService.getAll(queryParams),
  });

  // Mutations
  const createUserMutation = useMutation({
    mutationFn: AdminUsersService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setShowCreateModal(false);
      resetCreateForm();
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateUserCommand }) =>
      AdminUsersService.update(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setShowEditModal(false);
      setSelectedUser(null);
    },
  });

  const activateUserMutation = useMutation({
    mutationFn: AdminUsersService.activate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });

  const deactivateUserMutation = useMutation({
    mutationFn: AdminUsersService.deactivate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });

  // Helper functions
  const resetCreateForm = () => {
    setCreateForm({
      name: '',
      email: '',
      password: '',
      phone: '',
      profileImage: '',
    });
  };

  const handleEdit = (user: UserDto) => {
    setSelectedUser(user);
    setEditForm({
      userId: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      profileImage: user.profileImage,
    });
    setShowEditModal(true);
  };

  const handleToggleStatus = (user: UserDto) => {
    if (user.isActive) {
      deactivateUserMutation.mutate(user.id);
    } else {
      activateUserMutation.mutate(user.id);
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilterValues(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilterValues({
      roleId: '',
      isActive: undefined,
      createdAfter: '',
      createdBefore: '',
    });
    setSearchTerm('');
    setCurrentPage(1);
  };

  // Filter options
  const filterOptions: FilterOption[] = [
    {
      key: 'roleId',
      label: 'الدور',
      type: 'select',
      options: [
        { value: 'ADMIN', label: 'مدير' },
        { value: 'HOTEL_OWNER', label: 'مالك عقار' },
        { value: 'HOTEL_MANAGER', label: 'مدير عقار' },
        { value: 'RECEPTIONIST', label: 'موظف استقبال' },
        { value: 'CUSTOMER', label: 'عميل' },
      ],
    },
    {
      key: 'isActive',
      label: 'الحالة',
      type: 'boolean',
    },
    {
      key: 'createdAfter',
      label: 'تاريخ التسجيل من',
      type: 'date',
    },
    {
      key: 'createdBefore',
      label: 'تاريخ التسجيل إلى',
      type: 'date',
    },
  ];

  // Table columns
  const columns: Column<UserDto>[] = [
    {
      key: 'profileImage',
      title: 'الصورة',
      width: '80px',
      render: (value: string, record: UserDto) => (
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
          {value ? (
            <img src={value} alt={record.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-500 text-sm">
              {record.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'name',
      title: 'الاسم',
      sortable: true,
    },
    {
      key: 'email',
      title: 'البريد الإلكتروني',
      sortable: true,
    },
    {
      key: 'phone',
      title: 'رقم الهاتف',
    },
    {
      key: 'isActive',
      title: 'الحالة',
      render: (value: boolean) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value ? 'نشط' : 'غير نشط'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      title: 'تاريخ التسجيل',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString('ar-SA'),
    },
  ];

  // Table actions
  const tableActions = [
    {
      label: 'تعديل',
      icon: '✏️',
      color: 'blue' as const,
      onClick: handleEdit,
    },
    {
      label: 'تفعيل/إلغاء تفعيل',
      icon: '🔄',
      color: 'yellow' as const,
      onClick: handleToggleStatus,
    },
    {
      label: 'أدوار',
      icon: '👤',
      color: 'green' as const,
      onClick: (user: UserDto) => {
        // TODO: Implement role management modal
        console.log('Manage roles for user:', user.id);
      },
    },
  ];

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">خطأ في تحميل البيانات</h2>
        <p className="text-gray-600">حدث خطأ أثناء تحميل بيانات المستخدمين. يرجى المحاولة مرة أخرى.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">إدارة المستخدمين</h1>
            <p className="text-gray-600 mt-1">
              إدارة جميع المستخدمين في النظام وتعيين الأدوار والصلاحيات
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              ➕ إضافة مستخدم جديد
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <SearchAndFilter
        searchPlaceholder="البحث في المستخدمين..."
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
        data={usersData?.items || []}
        columns={columns}
        loading={isLoading}
        pagination={{
          current: currentPage,
          total: usersData?.totalCount || 0,
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
        onRowClick={(record) => console.log('Row clicked:', record)}
      />

      {/* Create User Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="إضافة مستخدم جديد"
        size="md"
        footer={
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              إلغاء
            </button>
            <button
              onClick={() => createUserMutation.mutate(createForm)}
              disabled={createUserMutation.isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {createUserMutation.isPending ? 'جارٍ الإضافة...' : 'إضافة'}
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الاسم الكامل *
            </label>
            <input
              type="text"
              value={createForm.name}
              onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="أدخل الاسم الكامل"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              البريد الإلكتروني *
            </label>
            <input
              type="email"
              value={createForm.email}
              onChange={(e) => setCreateForm(prev => ({ ...prev, email: e.target.value }))}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="أدخل البريد الإلكتروني"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              كلمة المرور *
            </label>
            <input
              type="password"
              value={createForm.password}
              onChange={(e) => setCreateForm(prev => ({ ...prev, password: e.target.value }))}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="أدخل كلمة المرور"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              رقم الهاتف *
            </label>
            <input
              type="tel"
              value={createForm.phone}
              onChange={(e) => setCreateForm(prev => ({ ...prev, phone: e.target.value }))}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="أدخل رقم الهاتف"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              رابط الصورة الشخصية
            </label>
            <input
              type="url"
              value={createForm.profileImage}
              onChange={(e) => setCreateForm(prev => ({ ...prev, profileImage: e.target.value }))}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="أدخل رابط الصورة الشخصية (اختياري)"
            />
          </div>
        </div>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedUser(null);
        }}
        title="تعديل بيانات المستخدم"
        size="md"
        footer={
          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setShowEditModal(false);
                setSelectedUser(null);
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              إلغاء
            </button>
            <button
              onClick={() => updateUserMutation.mutate({ userId: editForm.userId, data: editForm })}
              disabled={updateUserMutation.isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {updateUserMutation.isPending ? 'جارٍ التحديث...' : 'تحديث'}
            </button>
          </div>
        }
      >
        {selectedUser && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الاسم الكامل
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
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                رقم الهاتف
              </label>
              <input
                type="tel"
                value={editForm.phone}
                onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                رابط الصورة الشخصية
              </label>
              <input
                type="url"
                value={editForm.profileImage}
                onChange={(e) => setEditForm(prev => ({ ...prev, profileImage: e.target.value }))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminUsers;