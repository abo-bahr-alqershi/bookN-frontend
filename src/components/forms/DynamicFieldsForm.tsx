import React, { useState, useEffect } from 'react';
import type { UnitTypeFieldDto } from '../../types/unit-type-field.types';
import type { FieldValueDto } from '../../types/unit-field-value.types';

interface DynamicFieldsFormProps {
  fields: UnitTypeFieldDto[];
  values?: FieldValueDto[];
  onChange: (fieldValues: Record<string, any>) => void;
  className?: string;
}

const DynamicFieldsForm: React.FC<DynamicFieldsFormProps> = ({
  fields,
  values = [],
  onChange,
  className = ''
}) => {
  const [fieldValues, setFieldValues] = useState<Record<string, any>>({});

  // Initialize field values from existing values
  useEffect(() => {
    const initialValues: Record<string, any> = {};
    
    // Set values from existing data
    values.forEach((value: FieldValueDto) => {
      initialValues[value.fieldId] = value.fieldValue;
    });
    
    // Set default values for fields without values
    fields.forEach(field => {
      if (!(field.fieldId in initialValues)) {
        initialValues[field.fieldId] = getDefaultValue(field);
      }
    });
    
    setFieldValues(initialValues);
    onChange(initialValues);
  }, [fields, values]);

  const getDefaultValue = (field: UnitTypeFieldDto) => {
    switch (field.fieldTypeId) {
      case 'boolean':
      case 'checkbox':
        return false;
      case 'multiselect':
        return [];
      case 'number':
      case 'currency':
      case 'percentage':
      case 'range':
        return field.validationRules?.min || 0;
      default:
        return '';
    }
  };

  const updateFieldValue = (fieldId: string, value: any) => {
    const newValues = { ...fieldValues, [fieldId]: value };
    setFieldValues(newValues);
    onChange(newValues);
  };

  const renderField = (field: UnitTypeFieldDto) => {
    const value = fieldValues[field.fieldId] || getDefaultValue(field);
    const isRequired = field.isRequired;

    switch (field.fieldTypeId) {
      case 'text':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => updateFieldValue(field.fieldId, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={field.description || `أدخل ${field.displayName}`}
            required={isRequired}
            minLength={field.validationRules?.minLength}
            maxLength={field.validationRules?.maxLength}
            pattern={field.validationRules?.pattern}
          />
        );

      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => updateFieldValue(field.fieldId, e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={field.description || `أدخل ${field.displayName}`}
            required={isRequired}
            minLength={field.validationRules?.minLength}
            maxLength={field.validationRules?.maxLength}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => updateFieldValue(field.fieldId, parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={field.description || `أدخل ${field.displayName}`}
            required={isRequired}
            min={field.validationRules?.min}
            max={field.validationRules?.max}
            step={field.validationRules?.step || 1}
          />
        );

      case 'currency':
        return (
          <div className="relative">
            <input
              type="number"
              value={value}
              onChange={(e) => updateFieldValue(field.fieldId, parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={field.description || `أدخل ${field.displayName}`}
              required={isRequired}
              min={field.validationRules?.min || 0}
              max={field.validationRules?.max}
              step="0.01"
            />
            <span className="absolute left-3 top-2 text-gray-500">
              {field.validationRules?.currency || 'ريال'}
            </span>
          </div>
        );

      case 'percentage':
        return (
          <div className="relative">
            <input
              type="number"
              value={value}
              onChange={(e) => updateFieldValue(field.fieldId, parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={field.description || `أدخل ${field.displayName}`}
              required={isRequired}
              min={0}
              max={100}
              step="0.1"
            />
            <span className="absolute left-3 top-2 text-gray-500">%</span>
          </div>
        );

      case 'boolean':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => updateFieldValue(field.fieldId, e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              required={isRequired && !value}
            />
            <label className="mr-2 text-sm text-gray-700">
              {field.description || 'نعم'}
            </label>
          </div>
        );

      case 'select':
        const selectOptions = field.fieldOptions?.options || [];
        return (
          <select
            value={value}
            onChange={(e) => updateFieldValue(field.fieldId, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={isRequired}
          >
            <option value="">اختر {field.displayName}</option>
            {selectOptions.map((option: string, index: number) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'multiselect':
        const multiselectOptions = field.fieldOptions?.options || [];
        const selectedValues = Array.isArray(value) ? value : [];
        return (
          <div className="space-y-2">
            {multiselectOptions.map((option: string, index: number) => (
              <label key={index} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option)}
                  onChange={(e) => {
                    const newValues = e.target.checked
                      ? [...selectedValues, option]
                      : selectedValues.filter(v => v !== option);
                    updateFieldValue(field.fieldId, newValues);
                  }}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="mr-2 text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'date':
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => updateFieldValue(field.fieldId, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={isRequired}
            min={field.validationRules?.minDate}
            max={field.validationRules?.maxDate}
          />
        );

      case 'datetime':
        return (
          <input
            type="datetime-local"
            value={value}
            onChange={(e) => updateFieldValue(field.fieldId, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={isRequired}
            min={field.validationRules?.minDate}
            max={field.validationRules?.maxDate}
          />
        );

      case 'time':
        return (
          <input
            type="time"
            value={value}
            onChange={(e) => updateFieldValue(field.fieldId, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={isRequired}
          />
        );

      case 'email':
        return (
          <input
            type="email"
            value={value}
            onChange={(e) => updateFieldValue(field.fieldId, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={field.description || `أدخل ${field.displayName}`}
            required={isRequired}
            pattern={field.validationRules?.pattern}
          />
        );

      case 'phone':
        return (
          <input
            type="tel"
            value={value}
            onChange={(e) => updateFieldValue(field.fieldId, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={field.description || `أدخل ${field.displayName}`}
            required={isRequired}
            pattern={field.validationRules?.pattern}
          />
        );

      case 'url':
        return (
          <input
            type="url"
            value={value}
            onChange={(e) => updateFieldValue(field.fieldId, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={field.description || `أدخل ${field.displayName}`}
            required={isRequired}
            pattern={field.validationRules?.pattern}
          />
        );

      case 'color':
        return (
          <input
            type="color"
            value={value}
            onChange={(e) => updateFieldValue(field.fieldId, e.target.value)}
            className="w-full h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={isRequired}
          />
        );

      case 'range':
        return (
          <div className="space-y-2">
            <input
              type="range"
              value={value}
              onChange={(e) => updateFieldValue(field.fieldId, parseFloat(e.target.value))}
              className="w-full"
              min={field.validationRules?.min || 0}
              max={field.validationRules?.max || 100}
              step={field.validationRules?.step || 1}
              required={isRequired}
            />
            <div className="text-center text-sm text-gray-600">
              القيمة: {value}
            </div>
          </div>
        );

      case 'rating':
        return (
          <div className="flex items-center space-x-1 space-x-reverse">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => updateFieldValue(field.fieldId, star)}
                className={`text-2xl ${
                  star <= value ? 'text-yellow-400' : 'text-gray-300'
                } hover:text-yellow-400`}
              >
                ⭐
              </button>
            ))}
            <span className="mr-2 text-sm text-gray-600">({value}/5)</span>
          </div>
        );

      case 'file':
        return (
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                updateFieldValue(field.fieldId, file.name);
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={isRequired}
            accept={field.validationRules?.allowedTypes?.map(type => `.${type}`).join(',')}
          />
        );

      case 'image':
        return (
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                updateFieldValue(field.fieldId, file.name);
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={isRequired}
            accept="image/*"
          />
        );

      case 'tag':
        const tags = Array.isArray(value) ? value : (value ? value.split(',') : []);
        return (
          <div className="space-y-2">
            <input
              type="text"
              placeholder="أدخل العلامات مفصولة بفاصلة"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ',') {
                  e.preventDefault();
                  const newTag = e.currentTarget.value.trim();
                  if (newTag && !tags.includes(newTag)) {
                    const newTags = [...tags, newTag];
                    updateFieldValue(field.fieldId, newTags);
                    e.currentTarget.value = '';
                  }
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => {
                      const newTags = tags.filter((_, i) => i !== index);
                      updateFieldValue(field.fieldId, newTags);
                    }}
                    className="mr-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => updateFieldValue(field.fieldId, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={field.description || `أدخل ${field.displayName}`}
            required={isRequired}
          />
        );
    }
  };

  const getFieldIcon = (fieldType: string) => {
    const icons: Record<string, string> = {
      text: '📝', textarea: '📄', number: '🔢', currency: '💰',
      percentage: '📊', boolean: '☑️', checkbox: '✅', select: '📋',
      multiselect: '📝', date: '📅', datetime: '⏰', time: '🕐',
      email: '📧', phone: '📞', url: '🔗', color: '🎨',
      range: '🎚️', rating: '⭐', file: '📎', image: '🖼️',
      tag: '🏷️'
    };
    return icons[fieldType] || '📝';
  };

  // Group fields by category or group
  const groupedFields = fields.reduce((groups, field) => {
    const category = field.category || field.groupId || 'عام';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(field);
    return groups;
  }, {} as Record<string, UnitTypeFieldDto[]>);

  if (fields.length === 0) {
    return (
      <div className={`text-center py-8 text-gray-500 ${className}`}>
        <div className="text-4xl mb-2">📝</div>
        <p>لا توجد حقول ديناميكية لهذا النوع من الوحدات</p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`} dir="rtl">
      {Object.entries(groupedFields).map(([category, categoryFields]) => (
        <div key={category} className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
            📁 {category}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categoryFields.map((field) => (
              <div key={field.fieldId} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <span className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-lg">{getFieldIcon(field.fieldTypeId)}</span>
                    <span>{field.displayName}</span>
                    {field.isRequired && <span className="text-red-500">*</span>}
                  </span>
                  {field.description && (
                    <span className="text-xs text-gray-500 block mt-1">
                      {field.description}
                    </span>
                  )}
                </label>
                {renderField(field)}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DynamicFieldsForm;