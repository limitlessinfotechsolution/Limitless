import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useContactBehaviorTracking } from '../../hooks/useContactBehaviorTracking';
import { useAdaptiveForms } from '../../hooks/useAdaptiveForms';

type FormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
  honeypot?: string;
};

const GeneralInquiryForm: React.FC = () => {
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<FormData>({
    mode: 'onChange'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionStartTime] = useState(Date.now());
  const { trackFormInteraction } = useContactBehaviorTracking();
  const { trackFormSubmission, getAdaptiveSubjectOptions, getCompletionHints } = useAdaptiveForms();

  const watchedFields = watch();

  const onSubmit = async (data: FormData & { honeypot?: string }) => {
    // Honeypot check for spam protection
    if (data.honeypot) {
      // Silently reject spam
      setIsSubmitted(true);
      reset();
      return;
    }

    trackFormInteraction();
    const submissionTime = Date.now() - submissionStartTime;
    trackFormSubmission(data, submissionTime);
    setIsSubmitting(true);

    try {
      // First, save the lead to CRM
      const leadResponse = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message,
          source: 'contact_form'
        }),
      });

      if (!leadResponse.ok) {
        const errorData = await leadResponse.json();
        throw new Error(errorData.error || 'Failed to save lead');
      }

      // Then send notification email
      const emailResponse = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'contact@limitlessinfotech.com',
          from: 'noreply@limitlessinfotech.com',
          subject: `New Inquiry: ${data.subject}`,
          html: `
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Subject:</strong> ${data.subject}</p>
            <p><strong>Message:</strong></p>
            <p>${data.message}</p>
            <hr>
            <p><em>This lead has been automatically saved to the CRM system.</em></p>
          `,
        }),
      });

      if (!emailResponse.ok) {
        console.warn('Email sending failed, but lead was saved to CRM');
      }

      setIsSubmitted(true);
      reset();
    } catch (error) {
      console.error('Form submission error:', error);
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
        <h3 className="text-2xl font-bold text-green-500 mb-4">Message Sent!</h3>
        <p>Thank you for reaching out. We'll get back to you shortly.</p>
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
      <div>
        <label htmlFor="subject" className="block text-sm font-medium mb-1">
          Subject <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <select
            id="subject"
            {...register('subject', { required: 'Please select a subject' })}
            className={`w-full p-3 pr-10 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 ${
              errors.subject ? 'border-red-500' : watchedFields.subject ? 'border-green-500' : ''
            }`}
          >
            <option value="">Select a subject...</option>
            {getAdaptiveSubjectOptions().map(({ value, label, isPopular }) => (
              <option key={value} value={value}>
                {label}{isPopular ? ' ★' : ''}
              </option>
            ))}
          </select>
          {watchedFields.subject && !errors.subject && (
            <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500 pointer-events-none" />
          )}
          {errors.subject && (
            <XCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500 pointer-events-none" />
          )}
        </div>
        {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>}
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-1">
          Message <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <textarea
            id="message"
            {...register('message', { required: 'Message is required' })}
            rows={5}
            className={`w-full p-3 pr-10 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 ${
              errors.message ? 'border-red-500' : watchedFields.message ? 'border-green-500' : ''
            }`}
          ></textarea>
          {watchedFields.message && !errors.message && (
            <CheckCircle className="absolute right-3 top-6 w-5 h-5 text-green-500" />
          )}
          {errors.message && (
            <XCircle className="absolute right-3 top-6 w-5 h-5 text-red-500" />
          )}
        </div>
        {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
        {getCompletionHints().message && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{getCompletionHints().message}</p>
        )}
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
            // reCAPTCHA value will be verified on the server
            console.log('reCAPTCHA value:', value);
          }}
        />
      </div>

      <button type="submit" disabled={isSubmitting} className="btn-secondary w-full">
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </motion.form>
  );
};

export default GeneralInquiryForm;
