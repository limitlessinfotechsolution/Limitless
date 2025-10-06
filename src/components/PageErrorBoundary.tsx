'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react';
import CardEnhanced from './ui/CardEnhanced';

interface Props {
  children: ReactNode;
  pageName?: string;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorId?: string;
}

class PageErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    const errorId = `page_error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      hasError: true,
      error,
      errorId
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Page Error Boundary (${this.props.pageName}):`, error, errorInfo);

    // Log to service
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorId: this.state.errorId,
      page: this.props.pageName,
      timestamp: new Date().toISOString(),
      url: window.location.href
    };

    console.log('Page error report:', errorReport);
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorId: undefined
    });
  };

  handleGoBack = () => {
    window.history.back();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[60vh] flex items-center justify-center p-4">
          <CardEnhanced variant="elevated" className="max-w-lg w-full p-8 text-center">
            {/* Error Icon */}
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>

            {/* Error Title */}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Page Error
            </h2>

            {/* Error Message */}
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Something went wrong while loading {this.props.pageName || 'this page'}.
              This issue has been reported to our team.
            </p>

            {/* Error Details (development only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Error Details (Development)
                </summary>
                <pre className="text-xs text-red-600 dark:text-red-400 whitespace-pre-wrap overflow-auto max-h-20">
                  {this.state.error.toString()}
                </pre>
                {this.state.errorId && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-600">
                    Error ID: <code className="bg-gray-200 dark:bg-gray-600 px-1 py-0.5 rounded">{this.state.errorId}</code>
                  </div>
                )}
              </details>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleRetry}
                className="flex-1 bg-accent hover:bg-accent/90 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </button>
              <button
                onClick={this.handleGoBack}
                className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </button>
            </div>
          </CardEnhanced>
        </div>
      );
    }

    return this.props.children;
  }
}

export default PageErrorBoundary;
