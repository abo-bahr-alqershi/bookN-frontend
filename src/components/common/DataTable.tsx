import { useState } from 'react';

export interface Column<T> {
  key: keyof T | string;
  title: string;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  width?: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  pagination?: {
    current: number;
    total: number;
    pageSize: number;
    onChange: (page: number, pageSize: number) => void;
  };
  onRowClick?: (record: T, index: number) => void;
  rowSelection?: {
    selectedRowKeys: string[];
    onChange: (selectedRowKeys: string[], selectedRows: T[]) => void;
  };
  actions?: {
    label: string;
    onClick: (record: T) => void;
    icon?: string;
    color?: 'blue' | 'green' | 'red' | 'yellow' | 'orange';
    show?: (record: T) => boolean;
  }[];
}

const DataTable = <T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  pagination,
  onRowClick,
  rowSelection,
  actions,
}: DataTableProps<T>) => {
  const [sortField, setSortField] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return '⚬';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  const getActionColor = (color: string) => {
    const colors = {
      blue: 'text-blue-600 hover:text-blue-800 hover:bg-blue-50',
      green: 'text-green-600 hover:text-green-800 hover:bg-green-50',
      red: 'text-red-600 hover:text-red-800 hover:bg-red-50',
      yellow: 'text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50',
      orange: 'text-orange-600 hover:text-orange-800 hover:bg-orange-50',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              {rowSelection && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    onChange={(e) => {
                      if (e.target.checked) {
                        const allKeys = data.map((_, index) => index.toString());
                        rowSelection.onChange(allKeys, data);
                      } else {
                        rowSelection.onChange([], []);
                      }
                    }}
                    checked={rowSelection.selectedRowKeys.length === data.length && data.length > 0}
                  />
                </th>
              )}
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ width: column.width }}
                >
                  <div className={`flex items-center justify-${column.align || 'right'}`}>
                    <span>{column.title}</span>
                    {column.sortable && (
                      <button
                        onClick={() => handleSort(column.key as string)}
                        className="mr-2 text-gray-400 hover:text-gray-600"
                      >
                        {getSortIcon(column.key as string)}
                      </button>
                    )}
                  </div>
                </th>
              ))}
              {actions && actions.length > 0 && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (rowSelection ? 1 : 0) + (actions ? 1 : 0)}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center">
                    <span className="text-4xl mb-2">📄</span>
                    <p>لا توجد بيانات للعرض</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((record, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`hover:bg-gray-50 transition-colors ${
                    onRowClick ? 'cursor-pointer' : ''
                  }`}
                  onClick={() => onRowClick?.(record, rowIndex)}
                >
                  {rowSelection && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={rowSelection.selectedRowKeys.includes(rowIndex.toString())}
                        onChange={(e) => {
                          const key = rowIndex.toString();
                          if (e.target.checked) {
                            rowSelection.onChange(
                              [...rowSelection.selectedRowKeys, key],
                              [...(rowSelection.selectedRowKeys.map(k => data[parseInt(k)])), record]
                            );
                          } else {
                            rowSelection.onChange(
                              rowSelection.selectedRowKeys.filter(k => k !== key),
                              rowSelection.selectedRowKeys.filter(k => k !== key).map(k => data[parseInt(k)])
                            );
                          }
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                  )}
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-${column.align || 'right'}`}
                    >
                      {column.render
                        ? column.render(record[column.key as keyof T], record, rowIndex)
                        : (record[column.key as keyof T] as React.ReactNode)}
                    </td>
                  ))}
                  {actions && actions.length > 0 && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2 space-x-reverse">
                        {actions
                          .filter(action => !action.show || action.show(record))
                          .map((action, actionIndex) => (
                            <button
                              key={actionIndex}
                              onClick={(e) => {
                                e.stopPropagation();
                                action.onClick(record);
                              }}
                              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${getActionColor(action.color || 'blue')}`}
                              title={action.label}
                            >
                              {action.icon && <span className="ml-1">{action.icon}</span>}
                              {action.label}
                            </button>
                          ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => pagination.onChange(pagination.current - 1, pagination.pageSize)}
              disabled={pagination.current <= 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              السابق
            </button>
            <button
              onClick={() => pagination.onChange(pagination.current + 1, pagination.pageSize)}
              disabled={pagination.current * pagination.pageSize >= pagination.total}
              className="mr-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              التالي
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                عرض{' '}
                <span className="font-medium">
                  {(pagination.current - 1) * pagination.pageSize + 1}
                </span>{' '}
                إلى{' '}
                <span className="font-medium">
                  {Math.min(pagination.current * pagination.pageSize, pagination.total)}
                </span>{' '}
                من{' '}
                <span className="font-medium">{pagination.total}</span> نتيجة
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => pagination.onChange(pagination.current - 1, pagination.pageSize)}
                  disabled={pagination.current <= 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ←
                </button>
                {Array.from({ length: Math.ceil(pagination.total / pagination.pageSize) }, (_, i) => i + 1)
                  .slice(
                    Math.max(0, pagination.current - 3),
                    Math.min(Math.ceil(pagination.total / pagination.pageSize), pagination.current + 2)
                  )
                  .map((page) => (
                    <button
                      key={page}
                      onClick={() => pagination.onChange(page, pagination.pageSize)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === pagination.current
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                <button
                  onClick={() => pagination.onChange(pagination.current + 1, pagination.pageSize)}
                  disabled={pagination.current * pagination.pageSize >= pagination.total}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  →
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;