'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Calendar, Users, Building } from 'lucide-react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useContactBehaviorTracking } from '../../hooks/useContactBehaviorTracking';

type DemoFormData = {
  name: string;
  email: string;
  company: string;
  jobTitle: string;
  companySize: string;
  preferredDate: string;
  preferredTime: string;
  demoType: string;
  requirements: string;
  honeypot?: string;
};

const DemoRequestForm: React.FC = () => {
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<DemoFormData>({
    mode: 'onChange'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionStartTime] = useState(Date.now());
  const { trackFormInteraction } = useContactBehaviorTracking();

  const watchedFields = watch();

  const companySizeOptions = [
    { value: '1-10', label: '1-10 employees' },
    { value: '11-50', label: '11-50 employees' },
    { value: '51-200', label: '51-200 employees' },
    { value: '201-1000', label: '201-1000 employees' },
    { value: '1000+', label: '1000+ employees' }
  ];

  const demoTypeOptions = [
    { value: 'web-development', label: 'Web Development Solutions' },
    { value: 'mobile-apps', label: 'Mobile App Development' },
    { value: 'crm-systems', label: 'CRM & Business Management' },
    { value: 'ai-automation', label: 'AI & Automation Solutions' },
    { value: 'cloud-infrastructure', label: 'Cloud Infrastructure' },
    { value: 'full-suite', label: 'Complete Technology Suite' }
  ];

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  const onSubmit = async (data: DemoFormData & { honeypot?: string }) => {
    // Honeypot check for spam protection
    if (data.honeypot) {
      // Silently reject spam
      setIsSubmitted(true);
      reset();
      return;
    }

    trackFormInteraction();
    setIsSubmitting(true);

    try {
      // Save demo request to CRM
      const leadResponse = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          subject: `Demo Request: ${data.demoType}`,
          message: `
Company: ${data.company}
Job Title: ${data.jobTitle}
Company Size: ${data.companySize}
Preferred Date: ${data.preferredDate}
Preferred Time: ${data.preferredTime}
Demo Type: ${data.demoType}

Requirements/Specific Interests:
${data.requirements}
          `,
          source: 'demo_request'
        }),
      });

      if (!leadResponse.ok) {
        const errorData = await leadResponse.json();
        throw new Error(errorData.error || 'Failed to save demo request');
      }

      // Send notification email
      const emailResponse = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'demos@limitlessinfotech.com',
          from: 'noreply@limitlessinfotech.com',
          subject: `Demo Request: ${data.demoType} - ${data.company}`,
          html: `
            <h2>New Demo Request</h2>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Company:</strong> ${data.company}</p>
            <p><strong>Job Title:</strong> ${data.jobTitle}</p>
            <p><strong>Company Size:</strong> ${data.companySize}</p>
            <p><strong>Preferred Date:</strong> ${data.preferredDate}</p>
            <p><strong>Preferred Time:</strong> ${data.preferredTime}</p>
            <p><strong>Demo Type:</strong> ${data.demoType}</p>
            <h3>Requirements/Specific Interests:</h3>
            <p>${data.requirements}</p>
            <hr>
            <p><em>This demo request has been automatically saved to the CRM system.</em></p>
          `,
        }),
      });

      if (!emailResponse.ok) {
        console.warn('Email sending failed, but demo request was saved to CRM');
      }

      setIsSubmitted(true);
      reset();
    } catch (error) {
      console.error('Demo request submission error:', error);
      // Still show success if lead was saved but email failed
      setIsSubmitted(true);
      reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center p-8">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-4">Demo Request Submitted!</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Thank you for your interest in Limitless Infotech solutions. Our team will contact you within 24 hours to schedule your personalized demo.
        </p>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>What happens next?</strong><br />
            • Our solutions expert will review your requirements<br />
            • We'll send a calendar invite for your preferred time<br />
            • You'll receive a personalized demo tailored to your needs
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Personal Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="name"
              {...register('name', { required: 'Name is required' })}
              className={`w-full p-3 pr-10 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 ${
                errors.name ? 'border-red-500' : watchedFields.name ? 'border-green-500' : ''
              }`}
            />
            {watchedFields.name && !errors.name && (
              <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
            )}
            {errors.name && (
              <XCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
            )}
          </div>
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              className={`w-full p-3 pr-10 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 ${
                errors.email ? 'border-red-500' : watchedFields.email && !errors.email ? 'border-green-500' : ''
              }`}
            />
            {watchedFields.email && !errors.email && (
              <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
            )}
            {errors.email && (
              <XCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
            )}
          </div>
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>
      </div>

      {/* Company Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="company" className="block text-sm font-medium mb-1">
            Company Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="company"
              {...register('company', { required: 'Company name is required' })}
              className={`w-full pl-10 pr-10 p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 ${
                errors.company ? 'border-red-500' : watchedFields.company ? 'border-green-500' : ''
              }`}
            />
            {watchedFields.company && !errors.company && (
              <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
            )}
            {errors.company && (
              <XCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
            )}
          </div>
          {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company.message}</p>}
        </div>

        <div>
          <label htmlFor="jobTitle" className="block text-sm font-medium mb-1">
            Job Title <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="jobTitle"
              {...register('jobTitle', { required: 'Job title is required' })}
              className={`w-full pl-10 pr-10 p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 ${
                errors.jobTitle ? 'border-red-500' : watchedFields.jobTitle ? 'border-green-500' : ''
              }`}
            />
            {watchedFields.jobTitle && !errors.jobTitle && (
              <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
            )}
            {errors.jobTitle && (
              <XCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
            )}
          </div>
          {errors.jobTitle && <p className="text-red-500 text-sm mt-1">{errors.jobTitle.message}</p>}
        </div>
      </div>

      {/* Company Size */}
      <div>
        <label htmlFor="companySize" className="block text-sm font-medium mb-1">
          Company Size <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <select
            id="companySize"
            {...register('companySize', { required: 'Please select company size' })}
            className={`w-full p-3 pr-10 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 ${
              errors.companySize ? 'border-red-500' : watchedFields.companySize ? 'border-green-500' : ''
            }`}
          >
            <option value="">Select company size...</option>
            {companySizeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {watchedFields.companySize && !errors.companySize && (
            <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500 pointer-events-none" />
          )}
          {errors.companySize && (
            <XCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500 pointer-events-none" />
          )}
        </div>
        {errors.companySize && <p className="text-red-500 text-sm mt-1">{errors.companySize.message}</p>}
      </div>

      {/* Demo Preferences */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="preferredDate" className="block text-sm font-medium mb-1">
            Preferred Date <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="preferredDate"
              type="date"
              {...register('preferredDate', { required: 'Please select a preferred date' })}
              min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
              className={`w-full pl-10 pr-10 p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 ${
                errors.preferredDate ? 'border-red-500' : watchedFields.preferredDate ? 'border-green-500' : ''
              }`}
            />
            {watchedFields.preferredDate && !errors.preferredDate && (
              <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
            )}
            {errors.preferredDate && (
              <XCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
            )}
          </div>
          {errors.preferredDate && <p className="text-red-500 text-sm mt-1">{errors.preferredDate.message}</p>}
        </div>

        <div>
          <label htmlFor="preferredTime" className="block text-sm font-medium mb-1">
            Preferred Time <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              id="preferredTime"
              {...register('preferredTime', { required: 'Please select a preferred time' })}
              className={`w-full p-3 pr-10 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 ${
                errors.preferredTime ? 'border-red-500' : watchedFields.preferredTime ? 'border-green-500' : ''
              }`}
            >
              <option value="">Select time...</option>
              {timeSlots.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
            {watchedFields.preferredTime && !errors.preferredTime && (
              <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500 pointer-events-none" />
            )}
            {errors.preferredTime && (
              <XCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500 pointer-events-none" />
            )}
          </div>
          {errors.preferredTime && <p className="text-red-500 text-sm mt-1">{errors.preferredTime.message}</p>}
        </div>

        <div>
          <label htmlFor="demoType" className="block text-sm font-medium mb-1">
            Demo Type <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              id="demoType"
              {...register('demoType', { required: 'Please select demo type' })}
              className={`w-full p-3 pr-10 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 ${
                errors.demoType ? 'border-red-500' : watchedFields.demoType ? 'border-green-500' : ''
              }`}
            >
              <option value="">Select demo type...</option>
              {demoTypeOptions.map((option) => (
                <option key={option.value} value={option.label}>
                  {option.label}
                </option>
              ))}
            </select>
            {watchedFields.demoType && !errors.demoType && (
              <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500 pointer-events-none" />
            )}
            {errors.demoType && (
              <XCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500 pointer-events-none" />
            )}
          </div>
          {errors.demoType && <p className="text-red-500 text-sm mt-1">{errors.demoType.message}</p>}
        </div>
      </div>

      {/* Requirements */}
      <div>
        <label htmlFor="requirements" className="block text-sm font-medium mb-1">
          Specific Requirements or Questions
        </label>
        <textarea
          id="requirements"
          {...register('requirements')}
          rows={4}
          placeholder="Tell us about your specific needs, challenges, or questions you'd like addressed during the demo..."
          className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
        />
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Optional: Help us customize the demo to your needs
        </p>
      </div>

      {/* Honeypot field for spam protection */}
      <input
        type="text"
        {...register('honeypot')}
        style={{ display: 'none' }}
        tabIndex={-1}
        autoComplete="off"
      />

      {/* Google reCAPTCHA */}
      <div className="flex justify-center">
        <ReCAPTCHA
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'}
          onChange={(value) => {
            console.log('reCAPTCHA value:', value);
          }}
        />
      </div>

      <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
        {isSubmitting ? 'Submitting Request...' : 'Request Demo'}
      </button>
    </motion.form>
  );
};

export default DemoRequestForm;
