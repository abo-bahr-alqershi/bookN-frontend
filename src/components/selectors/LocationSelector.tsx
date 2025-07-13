import React, { useState, useEffect, useRef } from 'react';

interface LocationSelectorProps {
  latitude?: number;
  longitude?: number;
  onChange: (latitude: number, longitude: number, address?: string) => void;
  className?: string;
  disabled?: boolean;
  showMap?: boolean;
  allowManualInput?: boolean;
  placeholder?: string;
  required?: boolean;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  latitude = 24.7136,
  longitude = 46.6753, // الرياض كموقع افتراضي
  onChange,
  className = '',
  disabled = false,
  showMap = true,
  allowManualInput = true,
  placeholder = 'حدد الموقع',
  required = false
}) => {
  const [currentLat, setCurrentLat] = useState(latitude);
  const [currentLng, setCurrentLng] = useState(longitude);
  const [address, setAddress] = useState('');
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const mapRef = useRef<HTMLDivElement>(null);

  // تحديث القيم عند تغيير المعامل الخارجي
  useEffect(() => {
    setCurrentLat(latitude);
    setCurrentLng(longitude);
  }, [latitude, longitude]);

  // الحصول على العنوان من الإحداثيات (جيوكودينغ عكسي)
  const getAddressFromCoordinates = async (lat: number, lng: number) => {
    try {
      setIsLoading(true);
      setError('');
      
      // استخدام OpenStreetMap Nominatim API (مجاني)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ar`
      );
      
      if (response.ok) {
        const data = await response.json();
        const displayName = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        setAddress(displayName);
        return displayName;
      }
    } catch (error) {
      console.error('خطأ في الحصول على العنوان:', error);
      setError('لا يمكن الحصول على العنوان');
    } finally {
      setIsLoading(false);
    }
    
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  };

  // البحث عن موقع بالاسم (جيوكودينغ)
  const searchLocation = async (query: string) => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=ye&limit=1&accept-language=ar`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          const result = data[0];
          const lat = parseFloat(result.lat);
          const lng = parseFloat(result.lon);
          
          setCurrentLat(lat);
          setCurrentLng(lng);
          setAddress(result.display_name);
          onChange(lat, lng, result.display_name);
          
          return { lat, lng, address: result.display_name };
        } else {
          setError('لم يتم العثور على الموقع');
        }
      }
    } catch (error) {
      console.error('خطأ في البحث:', error);
      setError('خطأ في البحث عن الموقع');
    } finally {
      setIsLoading(false);
    }
    
    return null;
  };

  // الحصول على الموقع الحالي للمستخدم
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('الجهاز لا يدعم تحديد الموقع');
      return;
    }

    setIsLoading(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        setCurrentLat(lat);
        setCurrentLng(lng);
        
        const addressResult = await getAddressFromCoordinates(lat, lng);
        onChange(lat, lng, addressResult);
        
        setIsLoading(false);
      },
      (error) => {
        console.error('خطأ في تحديد الموقع:', error);
        setError('لا يمكن تحديد موقعك الحالي');
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  const handleManualCoordinateChange = (type: 'lat' | 'lng', value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    if (type === 'lat') {
      setCurrentLat(numValue);
      onChange(numValue, currentLng);
    } else {
      setCurrentLng(numValue);
      onChange(currentLat, numValue);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchQuery = formData.get('search') as string;
    if (searchQuery.trim()) {
      searchLocation(searchQuery.trim());
    }
  };

  // فتح خريطة خارجية (Google Maps)
  const openExternalMap = () => {
    const url = `https://www.google.com/maps?q=${currentLat},${currentLng}`;
    window.open(url, '_blank');
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* عرض الموقع الحالي */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
        <div className="flex-1">
          {isLoading ? (
            <div className="flex items-center space-x-2 space-x-reverse">
              <div className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
              <span className="text-sm text-gray-600">جارٍ التحديد...</span>
            </div>
          ) : address ? (
            <div>
              <p className="text-sm font-medium text-gray-900 truncate">{address}</p>
              <p className="text-xs text-gray-500">
                📍 {currentLat.toFixed(6)}, {currentLng.toFixed(6)}
              </p>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-500">{placeholder}</p>
              <p className="text-xs text-gray-400">
                📍 {currentLat.toFixed(6)}, {currentLng.toFixed(6)}
              </p>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2 space-x-reverse">
          {showMap && (
            <button
              type="button"
              onClick={openExternalMap}
              disabled={disabled}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              title="فتح في الخريطة"
            >
              🗺️
            </button>
          )}
          
          <button
            type="button"
            onClick={getCurrentLocation}
            disabled={disabled || isLoading}
            className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors"
            title="موقعي الحالي"
          >
            📍
          </button>
        </div>
      </div>

      {/* البحث عن موقع */}
      <form onSubmit={handleSearchSubmit} className="flex space-x-2 space-x-reverse">
        <input
          type="text"
          name="search"
          placeholder="ابحث عن موقع (مثل: الرياض، شارع الملك فهد)"
          disabled={disabled}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={disabled || isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          🔍
        </button>
      </form>

      {/* الإدخال اليدوي للإحداثيات */}
      {allowManualInput && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              خط العرض (Latitude)
            </label>
            <input
              type="number"
              step="0.000001"
              value={currentLat}
              onChange={(e) => handleManualCoordinateChange('lat', e.target.value)}
              disabled={disabled}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="24.7136"
              min="-90"
              max="90"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              خط الطول (Longitude)
            </label>
            <input
              type="number"
              step="0.000001"
              value={currentLng}
              onChange={(e) => handleManualCoordinateChange('lng', e.target.value)}
              disabled={disabled}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="46.6753"
              min="-180"
              max="180"
            />
          </div>
        </div>
      )}

      {/* رسائل الخطأ */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">⚠️ {error}</p>
        </div>
      )}

      {/* مؤشر التحقق من صحة البيانات */}
      {required && (!currentLat || !currentLng) && (
        <div className="p-2 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-xs text-yellow-800">⚠️ تحديد الموقع مطلوب</p>
        </div>
      )}

      {/* نصائح للاستخدام */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>💡 نصائح:</p>
        <ul className="list-disc list-inside space-y-1 mr-4">
          <li>اضغط على 📍 للحصول على موقعك الحالي</li>
          <li>ابحث بالاسم أو العنوان للعثور على الموقع</li>
          <li>يمكنك إدخال الإحداثيات يدوياً بدقة 6 خانات عشرية</li>
          <li>اضغط على 🗺️ لفتح الموقع في خرائط جوجل</li>
        </ul>
      </div>
    </div>
  );
};

export default LocationSelector;