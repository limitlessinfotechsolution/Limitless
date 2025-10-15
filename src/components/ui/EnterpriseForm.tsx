import React, { useState } from 'react';
import { Card } from './Card';

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'textarea' | 'select';
  required?: boolean;
  options?: string[];
}

interface EnterpriseFormProps {
  title: string;
  fields: FormField[];
  onSubmit: (data: Record<string, string>) => void;
  submitLabel?: string;
}

const EnterpriseForm: React.FC<EnterpriseFormProps> = ({
  title,
  fields,
  onSubmit,
  submitLabel = 'Submit'
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="enterprise-form">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map((field) => (
          <div key={field.id}>
            <label htmlFor={field.id} className="block text-sm font-medium mb-1">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                id={field.id}
                value={formData[field.id] || ''}
                onChange={(e) => handleChange(field.id, e.target.value)}
                required={field.required}
                className="w-full p-2 border rounded"
                rows={4}
              />
            ) : field.type === 'select' ? (
              <select
                id={field.id}
                value={formData[field.id] || ''}
                onChange={(e) => handleChange(field.id, e.target.value)}
                required={field.required}
                className="w-full p-2 border rounded"
              >
                <option value="">Select...</option>
                {field.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={field.id}
                type={field.type}
                value={formData[field.id] || ''}
                onChange={(e) => handleChange(field.id, e.target.value)}
                required={field.required}
                className="w-full p-2 border rounded"
              />
            )}
          </div>
        ))}
        <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {submitLabel}
        </button>
      </form>
    </Card>
  );
};

export default EnterpriseForm;
