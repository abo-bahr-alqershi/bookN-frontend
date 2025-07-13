import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { PropertyUsersService } from '../../services/property-users.service';
import { AdminPropertyTypesService } from '../../services/admin-property-types.service';
import type { RegisterPropertyOwnerCommand } from '../../types/user.types';
import ActionButton from '../../components/ui/ActionButton';
import { Card } from '../../components/ui/Card';
import { useNotifications } from '../../hooks/useNotifications';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotifications();
  
  const [formData, setFormData] = useState<RegisterPropertyOwnerCommand>({
    name: '',
    email: '',
    password: '',
    phone: '',
    propertyTypeId: '',
    propertyName: '',
    description: '',
    address: '',
    city: '',
    latitude: undefined,
    longitude: undefined,
    starRating: 3
  });
  
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<RegisterPropertyOwnerCommand & { confirmPassword: string }>>({});
  const [acceptTerms, setAcceptTerms] = useState(false);

  const { data: propertyTypesData } = useQuery({
    queryKey: ['property-types'],
    queryFn: () => AdminPropertyTypesService.getAll({
      pageNumber: 1,
      pageSize: 100
    })
  });

  const registerMutation = useMutation({
    mutationFn: PropertyUsersService.registerPropertyOwner,
    onSuccess: (result) => {
      if (result.isSuccess) {
        showSuccess('تم إنشاء الحساب بنجاح! سيتم توجيهك لتسجيل الدخول');
        navigate('/auth/login');
      } else {
        showError(result.message || 'فشل في إنشاء الحساب');
      }
    },
    onError: (error: any) => {
      showError(error.response?.data?.message || 'حدث خطأ أثناء إنشاء الحساب');
    }
  });

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterPropertyOwnerCommand & { confirmPassword: string }> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'الاسم مطلوب';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'رقم الهاتف مطلوب';
    } else if (!/^[0-9+\-\s()]+$/.test(formData.phone)) {
      newErrors.phone = 'رقم الهاتف غير صحيح';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'كلمة المرور مطلوبة';
    } else if (formData.password.length < 6) {
      newErrors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    }
    
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'تأكيد كلمة المرور مطلوب';
    } else if (formData.password !== confirmPassword) {
      newErrors.confirmPassword = 'كلمة المرور غير متطابقة';
    }
    
    if (!formData.propertyTypeId) {
      newErrors.propertyTypeId = 'نوع العقار مطلوب';
    }
    
    if (!formData.propertyName.trim()) {
      newErrors.propertyName = 'اسم العقار مطلوب';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'عنوان العقار مطلوب';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'المدينة مطلوبة';
    }
    
    if (!acceptTerms) {
      showError('يجب الموافقة على الشروط والأحكام');
      return false;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      registerMutation.mutate(formData);
    }
  };

  const handleInputChange = (field: keyof RegisterPropertyOwnerCommand, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 shadow-xl">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
              <span className="text-white text-2xl font-bold">B</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">BookN</h1>
            <p className="text-gray-600">تسجيل مالك عقار جديد</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">البيانات الشخصية</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الاسم الكامل
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="أدخل اسمك الكامل"
                    disabled={registerMutation.isPending}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      errors.name 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300'
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="966501234567"
                    disabled={registerMutation.isPending}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-left ${
                      errors.phone 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300'
                    }`}
                    dir="ltr"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="owner@example.com"
                  disabled={registerMutation.isPending}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-left ${
                    errors.email 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300'
                  }`}
                  dir="ltr"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    كلمة المرور
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="كلمة المرور"
                      disabled={registerMutation.isPending}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-left pr-10 ${
                        errors.password 
                          ? 'border-red-300 focus:ring-red-500' 
                          : 'border-gray-300'
                      }`}
                      dir="ltr"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      disabled={registerMutation.isPending}
                    >
                      {showPassword ? 'إخفاء' : 'إظهار'}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تأكيد كلمة المرور
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirmPassword) {
                          setErrors(prev => ({ ...prev, confirmPassword: undefined }));
                        }
                      }}
                      placeholder="تأكيد كلمة المرور"
                      disabled={registerMutation.isPending}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-left pr-10 ${
                        errors.confirmPassword 
                          ? 'border-red-300 focus:ring-red-500' 
                          : 'border-gray-300'
                      }`}
                      dir="ltr"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      disabled={registerMutation.isPending}
                    >
                      {showConfirmPassword ? 'إخفاء' : 'إظهار'}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">بيانات العقار</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نوع العقار
                  </label>
                  <select
                    value={formData.propertyTypeId}
                    onChange={(e) => handleInputChange('propertyTypeId', e.target.value)}
                    disabled={registerMutation.isPending}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      errors.propertyTypeId 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300'
                    }`}
                  >
                    <option value="">اختر نوع العقار</option>
                    {propertyTypesData?.items?.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                  {errors.propertyTypeId && (
                    <p className="mt-1 text-sm text-red-600">{errors.propertyTypeId}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم العقار
                  </label>
                  <input
                    type="text"
                    value={formData.propertyName}
                    onChange={(e) => handleInputChange('propertyName', e.target.value)}
                    placeholder="فندق الراحة"
                    disabled={registerMutation.isPending}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      errors.propertyName 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300'
                    }`}
                  />
                  {errors.propertyName && (
                    <p className="mt-1 text-sm text-red-600">{errors.propertyName}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المدينة
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="الرياض"
                    disabled={registerMutation.isPending}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      errors.city 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300'
                    }`}
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    التقييم الأولي
                  </label>
                  <select
                    value={formData.starRating}
                    onChange={(e) => handleInputChange('starRating', parseInt(e.target.value))}
                    disabled={registerMutation.isPending}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value={1}>نجمة واحدة</option>
                    <option value={2}>نجمتان</option>
                    <option value={3}>3 نجوم</option>
                    <option value={4}>4 نجوم</option>
                    <option value={5}>5 نجوم</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عنوان العقار
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="شارع الملك فهد، حي العليا"
                  disabled={registerMutation.isPending}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                    errors.address 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300'
                  }`}
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                )}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وصف العقار (اختياري)
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="وصف مختصر عن العقار وخدماته"
                  disabled={registerMutation.isPending}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                disabled={registerMutation.isPending}
              />
              <div className="mr-3 text-sm">
                <p className="text-gray-700">
                  أوافق على{' '}
                  <Link to="/terms" className="text-blue-600 hover:text-blue-500">
                    الشروط والأحكام
                  </Link>
                  {' '}و{' '}
                  <Link to="/privacy" className="text-blue-600 hover:text-blue-500">
                    سياسة الخصوصية
                  </Link>
                </p>
              </div>
            </div>

            <ActionButton
              type="submit"
              variant="primary"
              label={registerMutation.isPending ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب'}
              onClick={() => {}}
              className="w-full py-3"
              disabled={registerMutation.isPending || !acceptTerms}
            />
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              لديك حساب بالفعل؟{' '}
              <Link
                to="/auth/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                سجل الدخول
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Register;