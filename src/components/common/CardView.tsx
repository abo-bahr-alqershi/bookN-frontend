interface CardViewProps<T> {
  data: T[];
  loading?: boolean;
  renderCard: (item: T, index: number) => React.ReactNode;
  emptyMessage?: string;
  emptyIcon?: string;
  columns?: number;
}

const CardView = <T,>({
  data,
  loading = false,
  renderCard,
  emptyMessage = 'لا توجد بيانات للعرض',
  emptyIcon = '📄',
  columns = 3,
}: CardViewProps<T>) => {
  const getGridCols = (cols: number) => {
    const colsClasses = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
      5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
      6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
    };
    return colsClasses[cols as keyof typeof colsClasses] || colsClasses[3];
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">{emptyIcon}</div>
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className={`grid ${getGridCols(columns)} gap-6`}>
        {data.map((item, index) => (
          <div key={index} className="animate-fade-in">
            {renderCard(item, index)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardView;