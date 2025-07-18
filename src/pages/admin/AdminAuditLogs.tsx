import React, { useState } from 'react';
// أيقونات بسيطة بدلاً من lucide-react
const SearchIcon = () => <span>🔍</span>;
const UserIcon = () => <span>👤</span>;
const FilterIcon = () => <span>🔽</span>;
const EyeIcon = () => <span>👁️</span>;
const ClockIcon = () => <span>🕒</span>;
const DatabaseIcon = () => <span>💾</span>;
import { useAuditLogs } from '../../hooks/useAdminAuditLogs';
import type { AuditLogDto, AuditLogsQuery } from '../../types/audit-log.types';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';

const AdminAuditLogs = () => {
  const [query, setQuery] = useState<AuditLogsQuery>({
    pageNumber: 1,
    pageSize: 20,
  });
  const [selectedLog, setSelectedLog] = useState<AuditLogDto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    searchTerm: '',
    userId: '',
    from: '',
    to: '',
    operationType: '',
  });

  const { data, isLoading, error } = useAuditLogs(query);

  const handleSearch = () => {
    setQuery(prev => ({
      ...prev,
      pageNumber: 1,
      ...filters,
    }));
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      searchTerm: '',
      userId: '',
      from: '',
      to: '',
      operationType: '',
    };
    setFilters(clearedFilters);
    setQuery(prev => ({
      pageNumber: 1,
      pageSize: prev.pageSize,
    }));
  };

  const handleViewDetails = (log: AuditLogDto) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };

  const columns = [
    {
      header: 'التوقيت',
      title: 'التوقيت',
      key: 'timestamp',
      render: (log: AuditLogDto) => (
        <div className="flex items-center gap-2">
          <ClockIcon />
          <div>
            <div className="text-sm font-medium">
              {new Date(log.timestamp).toLocaleDateString('ar-SA')}
            </div>
            <div className="text-xs text-gray-500">
              {new Date(log.timestamp).toLocaleTimeString('ar-SA')}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'المستخدم',
      title: 'المستخدم',
      key: 'username',
      render: (log: AuditLogDto) => (
        <div className="flex items-center gap-2">
          <UserIcon />
          <div>
            <div className="text-sm font-medium">{log.username}</div>
            <div className="text-xs text-gray-500">{log.userId}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'العملية',
      title: 'العملية',
      key: 'action',
      render: (log: AuditLogDto) => (
        <div className="flex items-center gap-2">
          <DatabaseIcon />
          <div>
            <div className="text-sm font-medium">{log.action}</div>
            <div className="text-xs text-gray-500">{log.tableName}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'السجل المتأثر',
      title: 'السجل المتأثر',
      key: 'recordName',
      render: (log: AuditLogDto) => (
        <div>
          <div className="text-sm font-medium">{log.recordName}</div>
          <div className="text-xs text-gray-500">{log.recordId}</div>
        </div>
      ),
    },
    {
      header: 'التغييرات',
      title: 'التغييرات',
      key: 'changes',
      render: (log: AuditLogDto) => (
        <div className="max-w-xs">
          <div className="text-sm text-gray-700 truncate">{log.changes}</div>
          {log.isSlowOperation && (
            <div className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded mt-1 inline-block">
              عملية بطيئة
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'الإجراءات',
      title: 'الإجراءات',
      key: 'actions',
      render: (log: AuditLogDto) => (
        <button
          onClick={() => handleViewDetails(log)}
          className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
        >
          <EyeIcon />
          عرض التفاصيل
        </button>
      ),
    },
  ];

  const ChangeViewer = ({ log }: { log: AuditLogDto }) => {
    if (!log.oldValues && !log.newValues) {
      return (
        <div className="text-gray-500 text-center py-4">
          لا توجد تفاصيل التغييرات متاحة
        </div>
      );
    }

    const oldValues = log.oldValues || {};
    const newValues = log.newValues || {};
    const allKeys = new Set([...Object.keys(oldValues), ...Object.keys(newValues)]);

    return (
      <div className="space-y-4">
        {Array.from(allKeys).map(key => {
          const oldValue = oldValues[key];
          const newValue = newValues[key];
          const hasChanged = oldValue !== newValue;

          return (
            <div key={key} className="border rounded-lg p-4">
              <div className="font-medium text-gray-700 mb-2">{key}</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">القيمة القديمة</div>
                  <div className={`p-2 rounded border ${hasChanged ? 'bg-red-50 border-red-200' : 'bg-gray-50'}`}>
                    {oldValue !== undefined ? String(oldValue) : 'غير محدد'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">القيمة الجديدة</div>
                  <div className={`p-2 rounded border ${hasChanged ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}>
                    {newValue !== undefined ? String(newValue) : 'غير محدد'}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">سجلات التدقيق</h1>
          <p className="text-gray-600">مراقبة جميع الأنشطة والعمليات في النظام</p>
        </div>
      </div>

      {/* الفلاتر */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              البحث
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <SearchIcon />
              </div>
              <input
                type="text"
                value={filters.searchTerm}
                onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                placeholder="البحث في السجلات..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              معرف المستخدم
            </label>
            <input
              type="text"
              value={filters.userId}
              onChange={(e) => setFilters(prev => ({ ...prev, userId: e.target.value }))}
              placeholder="معرف المستخدم"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              من تاريخ
            </label>
            <input
              type="date"
              value={filters.from}
              onChange={(e) => setFilters(prev => ({ ...prev, from: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              إلى تاريخ
            </label>
            <input
              type="date"
              value={filters.to}
              onChange={(e) => setFilters(prev => ({ ...prev, to: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              نوع العملية
            </label>
            <input
              type="text"
              value={filters.operationType}
              onChange={(e) => setFilters(prev => ({ ...prev, operationType: e.target.value }))}
              placeholder="نوع العملية"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSearch}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FilterIcon />
            تطبيق الفلاتر
          </button>
          <button
            onClick={handleClearFilters}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            مسح الفلاتر
          </button>
        </div>
      </div>

      {/* الجدول */}
      <div className="bg-white rounded-lg shadow">
        <DataTable
          data={data?.items || []}
          columns={columns}
          loading={isLoading}
          pagination={{
            current: query.pageNumber || 1,
            total: data?.totalPages || 1,
            pageSize: query.pageSize || 20,
            onChange: (page, size) => setQuery(prev => ({ ...prev, pageNumber: page, pageSize: size })),
          }}
          onRowClick={() => {}}
        />
      </div>

      {/* مودال تفاصيل السجل */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="تفاصيل سجل التدقيق"
        size="lg"
      >
        {selectedLog && (
          <div className="space-y-6">
            {/* معلومات أساسية */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="text-sm text-gray-500">التوقيت</div>
                <div className="font-medium">
                  {new Date(selectedLog.timestamp).toLocaleString('ar-SA')}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">المستخدم</div>
                <div className="font-medium">{selectedLog.username}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">العملية</div>
                <div className="font-medium">{selectedLog.action}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">الجدول</div>
                <div className="font-medium">{selectedLog.tableName}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">معرف السجل</div>
                <div className="font-medium">{selectedLog.recordId}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">اسم السجل</div>
                <div className="font-medium">{selectedLog.recordName}</div>
              </div>
            </div>

            {/* الملاحظات */}
            {selectedLog.notes && (
              <div>
                <div className="text-sm text-gray-500 mb-2">الملاحظات</div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  {selectedLog.notes}
                </div>
              </div>
            )}

            {/* التغييرات */}
            <div>
              <div className="text-sm text-gray-500 mb-2">وصف التغييرات</div>
              <div className="p-3 bg-gray-50 border rounded-lg">
                {selectedLog.changes}
              </div>
            </div>

            {/* تفاصيل التغييرات */}
            <div>
              <div className="text-lg font-medium mb-4">تفاصيل التغييرات</div>
              <ChangeViewer log={selectedLog} />
            </div>

            {/* البيانات الإضافية */}
            {selectedLog.metadata && Object.keys(selectedLog.metadata).length > 0 && (
              <div>
                <div className="text-sm text-gray-500 mb-2">البيانات الإضافية</div>
                <div className="p-3 bg-gray-50 border rounded-lg">
                  <pre className="text-sm overflow-x-auto">
                    {JSON.stringify(selectedLog.metadata, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminAuditLogs;