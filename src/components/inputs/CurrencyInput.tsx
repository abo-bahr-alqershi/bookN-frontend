import React, { useState, useEffect } from 'react';

interface CurrencyInputProps {
  value?: number;
  currency?: string;
  onValueChange: (amount: number, currency: string) => void;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  showSymbol?: boolean;
  supportedCurrencies?: string[];
  direction?: 'rtl' | 'ltr';
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({
  value = 0,
  currency = 'SAR',
  onValueChange,
  className = '',
  disabled = false,
  placeholder = '0.00',
  required = false,
  min = 0,
  max,
  step = 0.01,
  showSymbol = true,
  supportedCurrencies = ['SAR', 'USD', 'EUR', 'AED'],
  direction = 'rtl'
}) => {
  const [amount, setAmount] = useState(value);
  const [selectedCurrency, setSelectedCurrency] = useState(currency);
  const [focused, setFocused] = useState(false);

  // تحديث القيم عند تغيير المعاملات الخارجية
  useEffect(() => {
    setAmount(value);
  }, [value]);

  useEffect(() => {
    setSelectedCurrency(currency);
  }, [currency]);

  // معلومات العملات
  const currencyInfo = {
    SAR: { symbol: 'ر.س', name: 'ريال سعودي', decimals: 2 },
    USD: { symbol: '$', name: 'دولار أمريكي', decimals: 2 },
    EUR: { symbol: '€', name: 'يورو', decimals: 2 },
    AED: { symbol: 'د.إ', name: 'درهم إماراتي', decimals: 2 },
    QAR: { symbol: 'ر.ق', name: 'ريال قطري', decimals: 2 },
    KWD: { symbol: 'د.ك', name: 'دينار كويتي', decimals: 3 },
    BHD: { symbol: 'د.ب', name: 'دينار بحريني', decimals: 3 },
    OMR: { symbol: 'ر.ع', name: 'ريال عماني', decimals: 3 }
  };

  const getCurrentCurrencyInfo = () => currencyInfo[selectedCurrency] || currencyInfo.SAR;

  // تنسيق المبلغ للعرض
  const formatAmount = (num: number) => {
    const info = getCurrentCurrencyInfo();
    return new Intl.NumberFormat('ar-SA', {
      minimumFractionDigits: focused ? 0 : info.decimals,
      maximumFractionDigits: info.decimals
    }).format(num);
  };

  // تنسيق المبلغ مع العملة
  const formatCurrency = (num: number, curr: string) => {
    const info = currencyInfo[curr] || currencyInfo.SAR;
    const formatted = new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: curr,
      minimumFractionDigits: info.decimals,
      maximumFractionDigits: info.decimals
    }).format(num);
    
    return formatted;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // السماح بالأرقام والفاصلة العشرية فقط
    if (inputValue === '' || /^\d*\.?\d*$/.test(inputValue)) {
      const numValue = inputValue === '' ? 0 : parseFloat(inputValue);
      
      if (!isNaN(numValue)) {
        // التحقق من الحد الأدنى والأقصى
        if (min !== undefined && numValue < min) return;
        if (max !== undefined && numValue > max) return;
        
        setAmount(numValue);
        onValueChange(numValue, selectedCurrency);
      }
    }
  };

  const handleCurrencyChange = (newCurrency: string) => {
    setSelectedCurrency(newCurrency);
    onValueChange(amount, newCurrency);
  };

  const incrementAmount = () => {
    const newAmount = amount + step;
    if (max === undefined || newAmount <= max) {
      setAmount(newAmount);
      onValueChange(newAmount, selectedCurrency);
    }
  };

  const decrementAmount = () => {
    const newAmount = amount - step;
    if (newAmount >= min) {
      setAmount(newAmount);
      onValueChange(newAmount, selectedCurrency);
    }
  };

  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = () => {
    setFocused(false);
    // تنسيق المبلغ عند فقدان التركيز
    const info = getCurrentCurrencyInfo();
    const rounded = Math.round(amount * Math.pow(10, info.decimals)) / Math.pow(10, info.decimals);
    if (rounded !== amount) {
      setAmount(rounded);
      onValueChange(rounded, selectedCurrency);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className={`
        flex items-center border rounded-md shadow-sm bg-white
        ${focused ? 'ring-2 ring-blue-500 border-blue-500' : 'border-gray-300'}
        ${disabled ? 'bg-gray-50' : ''}
        ${required && amount === 0 ? 'border-red-300' : ''}
      `}>
        
        {/* أزرار الزيادة والنقصان */}
        <div className="flex flex-col border-l border-gray-300">
          <button
            type="button"
            onClick={incrementAmount}
            disabled={disabled || (max !== undefined && amount >= max)}
            className="px-2 py-1 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-500 hover:text-gray-700"
          >
            ▲
          </button>
          <button
            type="button"
            onClick={decrementAmount}
            disabled={disabled || amount <= min}
            className="px-2 py-1 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-500 hover:text-gray-700"
          >
            ▼
          </button>
        </div>

        {/* حقل إدخال المبلغ */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={focused ? amount.toString() : formatAmount(amount)}
            onChange={handleAmountChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            placeholder={placeholder}
            className={`
              w-full px-3 py-2 bg-transparent focus:outline-none
              ${direction === 'rtl' ? 'text-right' : 'text-left'}
              ${disabled ? 'cursor-not-allowed' : ''}
            `}
            dir={direction}
          />
          
          {/* رمز العملة */}
          {showSymbol && (
            <div className={`
              absolute top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500
              ${direction === 'rtl' ? 'left-3' : 'right-3'}
            `}>
              {getCurrentCurrencyInfo().symbol}
            </div>
          )}
        </div>

        {/* اختيار العملة */}
        <div className="border-r border-gray-300">
          <select
            style={{ direction: direction === 'rtl' ? 'rtl' : 'ltr' ,float: direction === 'rtl' ? 'right' : 'left'}}
            value={selectedCurrency}
            onChange={(e) => handleCurrencyChange(e.target.value)}
            disabled={disabled}
            className="px-3 py-2 bg-transparent focus:outline-none border-none appearance-none cursor-pointer"
          >
            {supportedCurrencies.map((curr) => (
              <option key={curr} value={curr}>
                {curr}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* عرض المبلغ المنسق */}
      {!focused && amount > 0 && (
        <div className="mt-1 text-sm text-gray-600 text-center">
          {formatCurrency(amount, selectedCurrency)}
        </div>
      )}

      {/* معلومات العملة */}
      <div className="mt-1 text-xs text-gray-500 text-center">
        {getCurrentCurrencyInfo().name}
      </div>

      {/* الحد الأدنى والأقصى */}
      {(min > 0 || max !== undefined) && (
        <div className="mt-1 text-xs text-gray-400 text-center">
          {min > 0 && `الحد الأدنى: ${formatCurrency(min, selectedCurrency)}`}
          {min > 0 && max !== undefined && ' • '}
          {max !== undefined && `الحد الأقصى: ${formatCurrency(max, selectedCurrency)}`}
        </div>
      )}

      {/* تحذير التحقق */}
      {required && amount === 0 && (
        <div className="mt-1 text-xs text-red-600">
          ⚠️ المبلغ مطلوب
        </div>
      )}

      {/* نصائح للاستخدام */}
      {focused && (
        <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
          💡 يمكنك استخدام الأسهم ▲▼ أو كتابة المبلغ مباشرة
        </div>
      )}
    </div>
  );
};

export default CurrencyInput;