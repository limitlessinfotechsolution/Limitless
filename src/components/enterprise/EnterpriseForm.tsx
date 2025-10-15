import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  MapPin, 
  Calendar,
  Save,
  X,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import Button from './Button';
import { Card } from';

interface FormField {
  id: string;
  label: string;
  type: string;
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: (value: string) => string | null;
}

interface EnterpriseFormProps {
  title: string;
  description?: string;
  fields: FormField[];
  onSubmit: (data: Record<string, string>) => void;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  className?: string;
}

const EnterpriseForm: React.FC<EnterpriseFormProps> = ({
  title,
  description,
  fields,
  onSubmit,
  onCancel,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  className = ''
}) => {
  const [formData, setFormData] = useState<Record<string, string>>(
    fields.reduce((acc, field) => ({ ...acc, [field.id]: '' }), {})
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateField = (field: FormField, value: string): string | null => {
    if (field.required && !value.trim()) {
      return `${field.label} is required`;
    }
    
    if (field.validation) {
      return field.validation(value);
    }
    
    return null;
  };

  const handleChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
    
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const handleBlur = (field: FormField) => {
    const error = validateField(field, formData[field.id]);
    if (error) {
      setErrors(prev => ({ ...prev, [field.id]: error }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: Record<string, string> = {};
    fields.forEach(field => {
      const error = validateField(field, formData[field.id]);
      if (error) {
        newErrors[field.id] = error;
      }
    });
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setSubmitSuccess(true);
      // Reset success message after 3 seconds
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputIcon = (type: string) => {
    switch (type) {
      case 'text':
      case 'name':
        return <User className="w-5 h-5 text-gray-400" />;
      case 'email':
        return <Mail className="w-5 h-5 text-gray-400" />;
      case 'tel':
      case 'phone':
        return <Phone className="w-5 h-5 text-gray-400" />;
      case 'company':
        return <Building className="w-5 h-5 text-gray-400" />;
      case 'address':
        return <MapPin className="w-5 h-5 text-gray-400" />;
      case 'date':
        return <Calendar className="w-5 h-5 text-gray-400" />;
      default:
        return null;
    }
  };

  return (
    <Card className={`p-6 ${className}`} variant="feature">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>

      {submitSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 flex items-center"
        >
          <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
          <span className="text-sm text-green-700 dark:text-green-300">
            Form submitted successfully!
          </span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((field) => (
            <div key={field.id} className="space-y-1">
              <label 
                htmlFor={field.id} 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              
              {field.type === 'select' ? (
                <div className="relative">
                  <select
                    id={field.id}
                    value={formData[field.id]}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    onBlur={() => handleBlur(field)}
                    className={`w-full pl-10 pr-3 py-2 border ${
                      errors[field.id] 
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-300 dark:border-gray-600 focus:ring-accent focus:border-accent'
                    } rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm transition-colors`}
                  >
                    <option value="">{field.placeholder || 'Select an option'}</option>
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {getInputIcon('text')}
                  </div>
                </div>
              ) : field.type === 'textarea' ? (
                <textarea
                  id={field.id}
                  value={formData[field.id]}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  onBlur={() => handleBlur(field)}
                  placeholder={field.placeholder}
                  rows={4}
                  className={`w-full px-3 py-2 border ${
                    errors[field.id] 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:ring-accent focus:border-accent'
                  } rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm transition-colors`}
                />
              ) : (
                <div className="relative">
                  <input
                    type={field.type}
                    id={field.id}
                    value={formData[field.id]}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    onBlur={() => handleBlur(field)}
                    placeholder={field.placeholder}
                    className={`w-full pl-10 pr-3 py-2 border ${
                      errors[field.id] 
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-300 dark:border-gray-600 focus:ring-accent focus:border-accent'
                    } rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm transition-colors`}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {getInputIcon(field.type)}
                  </div>
                </div>
              )}
              
              {errors[field.id] && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex items-center mt-1"
                >
                  <AlertCircle className="w-4 h-4 text-red-500 mr-1" />
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors[field.id]}
                  </p>
                </motion.div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              icon={<X className="w-4 h-4" />}
            >
              {cancelLabel}
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            icon={isSubmitting ? undefined : <Save className="w-4 h-4" />}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                Saving...
              </span>
            ) : (
              submitLabel
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default EnterpriseForm;
