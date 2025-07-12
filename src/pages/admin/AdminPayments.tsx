import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DataTable, { type Column } from '../../components/common/DataTable';
import SearchAndFilter, { type FilterOption } from '../../components/common/SearchAndFilter';
import Modal from '../../components/common/Modal';
import { AdminPaymentsService } from '../../services/admin-payments.service';
import type {
  PaymentDto,
  PaymentStatus,
  PaymentMethod,
  RefundPaymentCommand,
  VoidPaymentCommand,
  UpdatePaymentStatusCommand,
  GetPaymentsByStatusQuery,
  MoneyDto
} from '../../types/payment.types';

const AdminPayments = () => {
  const queryClient = useQueryClient();
  
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [filterValues, setFilterValues] = useState<Record<string, any>>({
    status: '',
    method: '',
    bookingId: '',
    userId: '',
    minAmount: '',
    maxAmount: '',
    startDate: '',
    endDate: '',
  });

  // State for modals
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showVoidModal, setShowVoidModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentDto | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // State for forms
  const [refundForm, setRefundForm] = useState<RefundPaymentCommand>({
    paymentId: '',
    refundAmount: { amount: 0, currency: 'SAR', formattedAmount: '' },
    refundReason: '',
  });

  const [statusForm, setStatusForm] = useState<UpdatePaymentStatusCommand>({
    paymentId: '',
    newStatus: 'Pending',
  });

  // Build query params
  const queryParams: GetPaymentsByStatusQuery = {
    status: filterValues.status as PaymentStatus || 'Successful',
    pageNumber: currentPage,
    pageSize,
  };

  // Fetch payments
  const { data: paymentsData, isLoading, error } = useQuery({
    queryKey: ['admin-payments', queryParams],
    queryFn: () => AdminPaymentsService.getByStatus(queryParams),
  });

  // Filter payments on client side for additional filters
  const filteredPayments = paymentsData?.items?.filter(payment => {
    if (filterValues.bookingId && !payment.bookingId.includes(filterValues.bookingId)) return false;
    if (filterValues.minAmount && payment.amount.amount < parseFloat(filterValues.minAmount)) return false;
    if (filterValues.maxAmount && payment.amount.amount > parseFloat(filterValues.maxAmount)) return false;
    if (searchTerm && !payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  }) || [];

  // Mutations
  const refundPaymentMutation = useMutation({
    mutationFn: (data: RefundPaymentCommand) => AdminPaymentsService.refund(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-payments'] });
      setShowRefundModal(false);
      setSelectedPayment(null);
      setRefundForm({
        paymentId: '',
        refundAmount: { amount: 0, currency: 'SAR', formattedAmount: '' },
        refundReason: '',
      });
    },
  });

  const voidPaymentMutation = useMutation({
    mutationFn: (data: VoidPaymentCommand) => AdminPaymentsService.void(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-payments'] });
      setShowVoidModal(false);
      setSelectedPayment(null);
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ paymentId, data }: { paymentId: string; data: UpdatePaymentStatusCommand }) =>
      AdminPaymentsService.updateStatus(paymentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-payments'] });
      setShowStatusModal(false);
      setSelectedPayment(null);
    },
  });

  // Helper functions
  const handleViewDetails = (payment: PaymentDto) => {
    setSelectedPayment(payment);
    setShowDetailsModal(true);
  };

  const handleRefund = (payment: PaymentDto) => {
    setSelectedPayment(payment);
    setRefundForm({
      paymentId: payment.id,
      refundAmount: { ...payment.amount },
      refundReason: '',
    });
    setShowRefundModal(true);
  };

  const handleVoid = (payment: PaymentDto) => {
    setSelectedPayment(payment);
    setShowVoidModal(true);
  };

  const handleUpdateStatus = (payment: PaymentDto) => {
    setSelectedPayment(payment);
    setStatusForm({
      paymentId: payment.id,
      newStatus: payment.status,
    });
    setShowStatusModal(true);
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilterValues(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilterValues({
      status: '',
      method: '',
      bookingId: '',
      userId: '',
      minAmount: '',
      maxAmount: '',
      startDate: '',
      endDate: '',
    });
    setSearchTerm('');
    setCurrentPage(1);
  };

  // Get status color
  const getStatusColor = (status: PaymentStatus) => {
    const statusColors = {
      Successful: 'bg-green-100 text-green-800',
      Failed: 'bg-red-100 text-red-800',
      Pending: 'bg-yellow-100 text-yellow-800',
      Refunded: 'bg-blue-100 text-blue-800',
      Voided: 'bg-gray-100 text-gray-800',
      PartiallyRefunded: 'bg-purple-100 text-purple-800',
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: PaymentStatus) => {
    const statusLabels = {
      Successful: 'ناجح',
      Failed: 'فاشل',
      Pending: 'معلق',
      Refunded: 'مسترد',
      Voided: 'ملغي',
      PartiallyRefunded: 'مسترد جزئياً',
    };
    return statusLabels[status] || status;
  };

  const getMethodLabel = (method: PaymentMethod) => {
    const methodLabels = {
      0: 'بطاقة ائتمان', // CreditCard
      1: 'PayPal',       // PayPal
      2: 'تحويل بنكي',   // BankTransfer
      3: 'نقداً',        // Cash
      4: 'أخرى',         // Other
    };
    return methodLabels[method as keyof typeof methodLabels] || 'غير محدد';
  };

  // Statistics calculation
  const stats = {
    total: filteredPayments.length,
    successful: filteredPayments.filter(p => p.status === 'Successful').length,
    pending: filteredPayments.filter(p => p.status === 'Pending').length,
    failed: filteredPayments.filter(p => p.status === 'Failed').length,
    refunded: filteredPayments.filter(p => p.status === 'Refunded' || p.status === 'PartiallyRefunded').length,
    totalAmount: filteredPayments
      .filter(p => p.status === 'Successful')
      .reduce((sum, p) => sum + p.amount.amount, 0),
  };

  // Filter options
  const filterOptions: FilterOption[] = [
    {
      key: 'status',
      label: 'حالة الدفع',
      type: 'select',
      options: [
        { value: 'Successful', label: 'ناجح' },
        { value: 'Failed', label: 'فاشل' },
        { value: 'Pending', label: 'معلق' },
        { value: 'Refunded', label: 'مسترد' },
        { value: 'Voided', label: 'ملغي' },
        { value: 'PartiallyRefunded', label: 'مسترد جزئياً' },
      ],
    },
    {
      key: 'method',
      label: 'طريقة الدفع',
      type: 'select',
      options: [
        { value: '0', label: 'بطاقة ائتمان' },
        { value: '1', label: 'PayPal' },
        { value: '2', label: 'تحويل بنكي' },
        { value: '3', label: 'نقداً' },
        { value: '4', label: 'أخرى' },
      ],
    },
    {
      key: 'bookingId',
      label: 'معرف الحجز',
      type: 'text',
      placeholder: 'أدخل معرف الحجز',
    },
    {
      key: 'userId',
      label: 'معرف المستخدم',
      type: 'text',
      placeholder: 'أدخل معرف المستخدم',
    },
    {
      key: 'minAmount',
      label: 'الحد الأدنى للمبلغ',
      type: 'number',
      placeholder: 'أدخل الحد الأدنى',
    },
    {
      key: 'maxAmount',
      label: 'الحد الأقصى للمبلغ',
      type: 'number',
      placeholder: 'أدخل الحد الأقصى',
    },
    {
      key: 'startDate',
      label: 'تاريخ البداية',
      type: 'date',
    },
    {
      key: 'endDate',
      label: 'تاريخ النهاية',
      type: 'date',
    },
  ];

  // Table columns
  const columns: Column<PaymentDto>[] = [
    {
      key: 'id',
      title: 'معرف الدفعة',
      sortable: true,
      render: (value: string) => (
        <span className="font-mono text-sm text-gray-600">
          {value.substring(0, 8)}...
        </span>
      ),
    },
    {
      key: 'transactionId',
      title: 'رقم المعاملة',
      sortable: true,
      render: (value: string) => (
        <span className="font-mono text-sm text-gray-900">{value}</span>
      ),
    },
    {
      key: 'bookingId',
      title: 'معرف الحجز',
      render: (value: string) => (
        <span className="font-mono text-sm text-gray-600">
          {value.substring(0, 8)}...
        </span>
      ),
    },
    {
      key: 'amount',
      title: 'المبلغ',
      render: (value: MoneyDto) => (
        <div className="text-left">
          <span className="font-medium text-lg">{value.amount}</span>
          <span className="text-sm text-gray-500 mr-1">{value.currency}</span>
        </div>
      ),
    },
    {
      key: 'method',
      title: 'طريقة الدفع',
      render: (value: PaymentMethod) => (
        <span className="text-sm">{getMethodLabel(value)}</span>
      ),
    },
    {
      key: 'status',
      title: 'الحالة',
      render: (value: PaymentStatus) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(value)}`}>
          {getStatusLabel(value)}
        </span>
      ),
    },
    {
      key: 'paymentDate',
      title: 'تاريخ الدفع',
      sortable: true,
      render: (value: string) => (
        <span className="text-sm text-gray-500">
          {new Date(value).toLocaleDateString('ar-SA')}
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
      label: 'استرداد',
      icon: '↩️',
      color: 'orange' as const,
      onClick: handleRefund,
      show: (payment: PaymentDto) => payment.status === 'Successful',
    },
    {
      label: 'إبطال',
      icon: '❌',
      color: 'red' as const,
      onClick: handleVoid,
      show: (payment: PaymentDto) => payment.status === 'Successful' || payment.status === 'Pending',
    },
    {
      label: 'تحديث الحالة',
      icon: '🔄',
      color: 'blue' as const,
      onClick: handleUpdateStatus,
      show: (payment: PaymentDto) => payment.status === 'Pending',
    },
  ];

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">خطأ في تحميل البيانات</h2>
        <p className="text-gray-600">حدث خطأ أثناء تحميل بيانات المدفوعات. يرجى المحاولة مرة أخرى.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">إدارة المدفوعات</h1>
            <p className="text-gray-600 mt-1">
              مراقبة وإدارة المدفوعات، الاستردادات، وإبطال المعاملات المالية
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-lg">
              <span className="text-2xl">💰</span>
            </div>
            <div className="mr-3">
              <p className="text-sm font-medium text-gray-600">إجمالي المدفوعات</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="bg-green-100 p-2 rounded-lg">
              <span className="text-2xl">✅</span>
            </div>
            <div className="mr-3">
              <p className="text-sm font-medium text-gray-600">ناجحة</p>
              <p className="text-2xl font-bold text-green-600">{stats.successful}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <span className="text-2xl">⏳</span>
            </div>
            <div className="mr-3">
              <p className="text-sm font-medium text-gray-600">معلقة</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="bg-red-100 p-2 rounded-lg">
              <span className="text-2xl">❌</span>
            </div>
            <div className="mr-3">
              <p className="text-sm font-medium text-gray-600">فاشلة</p>
              <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="bg-purple-100 p-2 rounded-lg">
              <span className="text-2xl">↩️</span>
            </div>
            <div className="mr-3">
              <p className="text-sm font-medium text-gray-600">مستردة</p>
              <p className="text-2xl font-bold text-purple-600">{stats.refunded}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="bg-emerald-100 p-2 rounded-lg">
              <span className="text-2xl">💵</span>
            </div>
            <div className="mr-3">
              <p className="text-sm font-medium text-gray-600">إجمالي المبلغ</p>
              <p className="text-lg font-bold text-emerald-600">{stats.totalAmount.toLocaleString()} ر.س</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <SearchAndFilter
        searchPlaceholder="البحث في المدفوعات (رقم المعاملة)..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filterOptions}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        showAdvanced={showAdvancedFilters}
        onToggleAdvanced={() => setShowAdvancedFilters(!showAdvancedFilters)}
      />

      {/* Payments Table */}
      <DataTable
        data={filteredPayments}
        columns={columns}
        loading={isLoading}
        pagination={{
          current: currentPage,
          total: paymentsData?.totalCount || 0,
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

      {/* Payment Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedPayment(null);
        }}
        title="تفاصيل الدفعة"
        size="lg"
      >
        {selectedPayment && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">معرف الدفعة</label>
                <p className="mt-1 text-sm text-gray-900 font-mono">{selectedPayment.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">رقم المعاملة</label>
                <p className="mt-1 text-sm text-gray-900 font-mono">{selectedPayment.transactionId}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">معرف الحجز</label>
                <p className="mt-1 text-sm text-gray-900 font-mono">{selectedPayment.bookingId}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">المبلغ</label>
                <p className="mt-1 text-sm text-gray-900 font-medium">
                  {selectedPayment.amount.amount} {selectedPayment.amount.currency}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">طريقة الدفع</label>
                <p className="mt-1 text-sm text-gray-900">{getMethodLabel(selectedPayment.method)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">حالة الدفع</label>
                <span className={`mt-1 inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedPayment.status)}`}>
                  {getStatusLabel(selectedPayment.status)}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">تاريخ الدفع</label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(selectedPayment.paymentDate).toLocaleString('ar-SA')}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Refund Payment Modal */}
      <Modal
        isOpen={showRefundModal}
        onClose={() => {
          setShowRefundModal(false);
          setSelectedPayment(null);
        }}
        title="استرداد الدفعة"
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setShowRefundModal(false);
                setSelectedPayment(null);
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              إلغاء
            </button>
            <button
              onClick={() => refundPaymentMutation.mutate(refundForm)}
              disabled={refundPaymentMutation.isPending || !refundForm.refundReason.trim()}
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50"
            >
              {refundPaymentMutation.isPending ? 'جارٍ الاسترداد...' : 'استرداد'}
            </button>
          </div>
        }
      >
        {selectedPayment && (
          <div className="space-y-4">
            <div className="bg-orange-50 border border-orange-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-orange-400 text-xl">⚠️</span>
                </div>
                <div className="mr-3">
                  <h3 className="text-sm font-medium text-orange-800">
                    تأكيد استرداد الدفعة
                  </h3>
                  <p className="mt-2 text-sm text-orange-700">
                    سيتم استرداد <strong>{refundForm.refundAmount.amount} {refundForm.refundAmount.currency}</strong> من المعاملة <strong>{selectedPayment.transactionId}</strong>.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  مبلغ الاسترداد
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={refundForm.refundAmount.amount}
                  onChange={(e) => setRefundForm(prev => ({ 
                    ...prev, 
                    refundAmount: { 
                      ...prev.refundAmount, 
                      amount: Number(e.target.value) 
                    }
                  }))}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  العملة
                </label>
                <input
                  type="text"
                  value={refundForm.refundAmount.currency}
                  disabled
                  className="block w-full rounded-md border-gray-300 shadow-sm bg-gray-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                سبب الاسترداد *
              </label>
              <textarea
                rows={3}
                value={refundForm.refundReason}
                onChange={(e) => setRefundForm(prev => ({ ...prev, refundReason: e.target.value }))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="أدخل سبب الاسترداد..."
              />
            </div>
          </div>
        )}
      </Modal>

      {/* Void Payment Modal */}
      <Modal
        isOpen={showVoidModal}
        onClose={() => {
          setShowVoidModal(false);
          setSelectedPayment(null);
        }}
        title="إبطال الدفعة"
        size="md"
        footer={
          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setShowVoidModal(false);
                setSelectedPayment(null);
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              إلغاء
            </button>
            <button
              onClick={() => voidPaymentMutation.mutate({ paymentId: selectedPayment!.id })}
              disabled={voidPaymentMutation.isPending}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              {voidPaymentMutation.isPending ? 'جارٍ الإبطال...' : 'إبطال الدفعة'}
            </button>
          </div>
        }
      >
        {selectedPayment && (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-red-400 text-xl">⚠️</span>
                </div>
                <div className="mr-3">
                  <h3 className="text-sm font-medium text-red-800">
                    تأكيد إبطال الدفعة
                  </h3>
                  <p className="mt-2 text-sm text-red-700">
                    هل أنت متأكد من إبطال الدفعة <strong>{selectedPayment.transactionId}</strong> بمبلغ <strong>{selectedPayment.amount.amount} {selectedPayment.amount.currency}</strong>؟
                    هذا الإجراء لا يمكن التراجع عنه.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Update Status Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => {
          setShowStatusModal(false);
          setSelectedPayment(null);
        }}
        title="تحديث حالة الدفعة"
        size="md"
        footer={
          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setShowStatusModal(false);
                setSelectedPayment(null);
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              إلغاء
            </button>
            <button
              onClick={() => updateStatusMutation.mutate({ 
                paymentId: statusForm.paymentId, 
                data: statusForm 
              })}
              disabled={updateStatusMutation.isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {updateStatusMutation.isPending ? 'جارٍ التحديث...' : 'تحديث'}
            </button>
          </div>
        }
      >
        {selectedPayment && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-blue-400 text-xl">ℹ️</span>
                </div>
                <div className="mr-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    تحديث حالة الدفعة
                  </h3>
                  <p className="mt-2 text-sm text-blue-700">
                    المعاملة: <strong>{selectedPayment.transactionId}</strong><br/>
                    الحالة الحالية: <strong>{getStatusLabel(selectedPayment.status)}</strong>
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الحالة الجديدة
              </label>
              <select
                value={statusForm.newStatus}
                onChange={(e) => setStatusForm(prev => ({ ...prev, newStatus: e.target.value as PaymentStatus }))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="Successful">ناجح</option>
                <option value="Failed">فاشل</option>
                <option value="Pending">معلق</option>
                <option value="Refunded">مسترد</option>
                <option value="Voided">ملغي</option>
                <option value="PartiallyRefunded">مسترد جزئياً</option>
              </select>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminPayments;