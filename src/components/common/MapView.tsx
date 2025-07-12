import { useState } from 'react';

interface MapItem {
  id: string;
  latitude?: number;
  longitude?: number;
  name: string;
  address?: string;
}

interface MapViewProps<T extends MapItem> {
  data: T[];
  loading?: boolean;
  renderPopup?: (item: T) => React.ReactNode;
  onItemClick?: (item: T) => void;
  emptyMessage?: string;
  height?: string;
}

const MapView = <T extends MapItem>({
  data,
  loading = false,
  renderPopup,
  onItemClick,
  emptyMessage = 'لا توجد عناصر لعرضها على الخريطة',
  height = '500px',
}: MapViewProps<T>) => {
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  
  // Filter items that have valid coordinates
  const validItems = data.filter(item => 
    item.latitude !== undefined && 
    item.longitude !== undefined &&
    item.latitude !== 0 && 
    item.longitude !== 0
  );

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200" style={{ height }}>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (validItems.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200" style={{ height }}>
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          <div className="text-6xl mb-4">🗺️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد مواقع للعرض</h3>
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Map Placeholder - In a real implementation, you would integrate with Google Maps, Mapbox, or similar */}
      <div 
        className="relative bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center"
        style={{ height }}
      >
        <div className="text-center p-8">
          <div className="text-8xl mb-4">🗺️</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">عرض الخريطة</h3>
          <p className="text-gray-600 mb-4">
            يتم عرض {validItems.length} موقع على الخريطة
          </p>
          <div className="bg-white rounded-lg shadow-sm p-4 max-w-sm mx-auto">
            <p className="text-sm text-gray-500 mb-2">المواقع المتاحة:</p>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {validItems.slice(0, 5).map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedItem(item);
                    onItemClick?.(item);
                  }}
                  className="w-full text-right px-2 py-1 text-xs bg-gray-50 hover:bg-gray-100 rounded transition-colors"
                >
                  📍 {item.name}
                </button>
              ))}
              {validItems.length > 5 && (
                <p className="text-xs text-gray-400 text-center">
                  و {validItems.length - 5} موقع آخر...
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Selected Item Popup */}
        {selectedItem && (
          <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-xs">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-2 left-2 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
            <div className="pr-6">
              <h4 className="font-medium text-gray-900 mb-1">{selectedItem.name}</h4>
              {selectedItem.address && (
                <p className="text-sm text-gray-600 mb-2">{selectedItem.address}</p>
              )}
              {selectedItem.latitude && selectedItem.longitude && (
                <p className="text-xs text-gray-500">
                  📍 {selectedItem.latitude.toFixed(6)}, {selectedItem.longitude.toFixed(6)}
                </p>
              )}
              {renderPopup && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  {renderPopup(selectedItem)}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Map Controls */}
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>عدد المواقع: {validItems.length}</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors">
              🔍 تكبير
            </button>
            <button className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors">
              🌍 عرض الكل
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;