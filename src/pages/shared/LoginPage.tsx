import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<'admin' | 'property-owner'>('admin');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Implement actual authentication with backend
    setTimeout(() => {
      setIsLoading(false);
      // Redirect based on selected role
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/property-owner/dashboard');
      }
    }, 1000);
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">تسجيل الدخول</h2>
        <p className="text-gray-600 mt-2">أدخل بياناتك للوصول إلى النظام</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Role Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            نوع المستخدم
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`p-3 rounded-lg border transition-colors ${
                role === 'admin'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <span className="block text-sm font-medium">مدير النظام</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('property-owner')}
              className={`p-3 rounded-lg border transition-colors ${
                role === 'property-owner'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <span className="block text-sm font-medium">مالك العقار</span>
            </button>
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            البريد الإلكتروني
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="أدخل البريد الإلكتروني"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            كلمة المرور
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="أدخل كلمة المرور"
            required
          />
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input type="checkbox" className="ml-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
            <span className="text-sm text-gray-600">تذكرني</span>
          </label>
          <button type="button" className="text-sm text-blue-600 hover:text-blue-500">
            نسيت كلمة المرور؟
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'جارٍ تسجيل الدخول...' : 'تسجيل الدخول'}
        </button>
      </form>

      {/* Demo Credentials */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">بيانات تجريبية:</h3>
        <div className="text-xs text-gray-600 space-y-1">
          <p><strong>مدير النظام:</strong> admin@example.com / password</p>
          <p><strong>مالك العقار:</strong> owner@example.com / password</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;