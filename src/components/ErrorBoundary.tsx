'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug, Mail, Phone, ExternalLink } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId?: string;
  retryCount: number;
  errorType: string;
  isRetrying: boolean;
  isSubmitting: boolean;
  formName: string;
  formEmail: string;
  formMessage: string;
}

class ErrorBoundary extends Component<Props, State> {
  private maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      retryCount: 0,
      errorType: 'general',
      isRetrying: false,
      isSubmitting: false,
      formName: '',
      formEmail: '',
      formMessage: ''
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Generate unique error ID for tracking
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      hasError: true,
      error,
      errorId
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
      errorType: this.categorizeError(error)
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log error to service
    this.logErrorToService(error, errorInfo);
  }

  logErrorToService = async (error: Error, errorInfo: ErrorInfo) => {
    try {
      // In a real app, you would send this to your error tracking service
      // For now, we'll just log it with additional context
      const errorReport = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        errorId: this.state.errorId,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        retryCount: this.state.retryCount
      };

      // Example: Send to analytics or error tracking service
      // await fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorReport)
      // });

      console.log('Error report:', errorReport);
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }
  };

  handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: undefined,
        errorInfo: undefined,
        retryCount: prevState.retryCount + 1
      }));
    }
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleReportIssue = () => {
    const subject = encodeURIComponent(`Error Report: ${this.state.errorId}`);
    const body = encodeURIComponent(`
Error ID: ${this.state.errorId}
Error Message: ${this.state.error?.message}
URL: ${window.location.href}
Timestamp: ${new Date().toISOString()}
User Agent: ${navigator.userAgent}

Please describe what you were doing when this error occurred:
    `);
    window.open(`mailto:support@limitlessinfotech.com?subject=${subject}&body=${body}`);
  };

  categorizeError = (error: Error): string => {
    const message = error.message.toLowerCase();
    if (message.includes('network') || message.includes('fetch') || message.includes('connection')) {
      return 'network';
    }
    if (message.includes('auth') || message.includes('unauthorized') || message.includes('forbidden')) {
      return 'auth';
    }
    return 'general';
  };

  getRecoverySuggestions = (errorType: string): string[] => {
    switch (errorType) {
      case 'network':
        return ['Check your internet connection', 'Try refreshing the page', 'Contact support if the issue persists'];
      case 'auth':
        return ['Try logging in again', 'Clear your browser cache', 'Contact support for account issues'];
      default:
        return ['Try refreshing the page', 'Clear your browser cache and cookies', 'Contact support for assistance'];
    }
  };

  handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    this.setState({ [name as 'formName' | 'formEmail' | 'formMessage']: value } as Pick<State, 'formName' | 'formEmail' | 'formMessage'>);
  };

  handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    this.setState({ isSubmitting: true });
    const { formName, formEmail, formMessage, errorId } = this.state;
    const subject = `Error Report: ${errorId} - Contact Form`;
    const body = `Name: ${formName}\nEmail: ${formEmail}\nMessage: ${formMessage}\nError ID: ${errorId}`;
    window.open(`mailto:support@limitlessinfotech.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    this.setState({ isSubmitting: false, formName: '', formEmail: '', formMessage: '' });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const canRetry = this.state.retryCount < this.maxRetries;

      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4" role="alert" aria-live="assertive">
          <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 text-center">
            {/* Error Icon */}
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>

            {/* Error Title */}
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Oops! Something went wrong
            </h1>

            {/* Error Subtitle */}
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              We encountered an unexpected error. Our team has been notified and is working to fix it.
            </p>

            {/* Recovery Suggestions */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">What you can try:</h3>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
                {this.getRecoverySuggestions(this.state.errorType).map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>

            {/* Retry Count Indicator */}
            {this.state.retryCount > 0 && (
              <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                Retry attempts: {this.state.retryCount} / {this.maxRetries}
              </div>
            )}

            {/* Error Details (only in development) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                  <Bug className="w-4 h-4 mr-2" />
                  Error Details (Development Only)
                </summary>
                <div className="space-y-2">
                  <div>
                    <strong className="text-red-600 dark:text-red-400">Error:</strong>
                    <pre className="text-xs text-red-600 dark:text-red-400 whitespace-pre-wrap overflow-auto max-h-20 mt-1 p-2 bg-red-50 dark:bg-red-900/10 rounded">
                      {this.state.error.toString()}
                    </pre>
                  </div>
                  {this.state.errorInfo?.componentStack && (
                    <div>
                      <strong className="text-gray-700 dark:text-gray-300">Component Stack:</strong>
                      <pre className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap overflow-auto max-h-32 mt-1 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                  {this.state.errorId && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-600">
                      Error ID: <code className="bg-gray-200 dark:bg-gray-600 px-1 py-0.5 rounded">{this.state.errorId}</code>
                    </div>
                  )}
                </div>
              </details>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              {canRetry && (
                <button
                  onClick={this.handleRetry}
                  className="flex-1 bg-accent hover:bg-accent-dark text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Try Again
                </button>
              )}
              <button
                onClick={this.handleGoHome}
                className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
              >
                <Home className="w-5 h-5 mr-2" />
                Go Home
              </button>
            </div>

            {/* Contact Details */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Contact Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Limitless Infotech</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">support@limitlessinfotech.com</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 mr-3 text-green-600 dark:text-green-400" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Phone</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">+917710909492</div>
                  </div>
                </div>
                <div className="flex items-center col-span-1 sm:col-span-2">
                  <Home className="w-5 h-5 mr-3 text-purple-600 dark:text-purple-400" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Address</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Mumbai, India</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Help */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Need Help?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={this.handleReportIssue}
                  className="flex items-center justify-center p-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors duration-200"
                >
                  <Mail className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400" />
                  <div className="text-left">
                    <div className="font-medium text-blue-900 dark:text-blue-100">Report Issue</div>
                    <div className="text-sm text-blue-700 dark:text-blue-300">Send error details</div>
                  </div>
                </button>
                <a
                  href="tel:+1234567890"
                  className="flex items-center justify-center p-4 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors duration-200"
                >
                  <Phone className="w-5 h-5 mr-3 text-green-600 dark:text-green-400" />
                  <div className="text-left">
                    <div className="font-medium text-green-900 dark:text-green-100">Call Support</div>
                    <div className="text-sm text-green-700 dark:text-green-300">+1 (234) 567-890</div>
                  </div>
                </a>
              </div>
              <div className="mt-4 text-center">
                <a
                  href="https://status.limitlessinfotech.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-accent transition-colors duration-200"
                >
                  Check System Status
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Report Issue
              </h3>
              <form onSubmit={this.handleFormSubmit} className="space-y-4">
                <div>
                  <label htmlFor="formName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                  <input
                    type="text"
                    id="formName"
                    name="formName"
                    value={this.state.formName}
                    onChange={this.handleFormChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label htmlFor="formEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                  <input
                    type="email"
                    id="formEmail"
                    name="formEmail"
                    value={this.state.formEmail}
                    onChange={this.handleFormChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label htmlFor="formMessage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
                  <textarea
                    id="formMessage"
                    name="formMessage"
                    value={this.state.formMessage}
                    onChange={this.handleFormChange}
                    required
                    rows={4}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <button
                  type="submit"
                  disabled={this.state.isSubmitting}
                  className="w-full bg-accent hover:bg-accent-dark text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {this.state.isSubmitting ? 'Sending...' : 'Send Report'}
                </button>
              </form>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
