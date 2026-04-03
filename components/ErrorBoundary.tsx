"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; reset: () => void }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("🚨 Error Boundary Caught:", error, errorInfo);
    
    // 🛡️ REPORT TO ERROR TRACKING SERVICE
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      // Integrate with Sentry, LogRocket, etc.
      console.log("Error would be reported to tracking service");
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} reset={this.handleReset} />;
      }

      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="min-h-screen flex items-center justify-center bg-[#FAFAFA] px-4"
        >
          <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 shadow-xl p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <AlertTriangle className="text-red-600" size={32} />
            </motion.div>
            
            <h1 className="text-2xl font-serif font-bold text-gray-900 mb-4">
              Oops! Something went wrong
            </h1>
            
            <p className="text-gray-600 mb-8 leading-relaxed">
              We're sorry, but something unexpected happened. 
              Our team has been notified and is working on a fix.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
                <p className="text-sm font-mono text-red-800 break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={this.handleReset}
              className="w-full bg-[#D4AF37] hover:bg-[#b5952f] text-white font-black uppercase tracking-widest py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw size={18} />
              Try Again
            </motion.button>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                If this problem persists, please contact our support team.
              </p>
              <a 
                href="mailto:support@essentialrush.com"
                className="text-xs text-[#D4AF37] hover:underline block mt-2"
              >
                support@essentialrush.com
              </a>
            </div>
          </div>
        </motion.div>
      );
    }

    return this.props.children;
  }
}

// 🎯 HOOK FOR FUNCTIONAL ERROR HANDLING
export const useErrorHandler = () => {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const handleError = React.useCallback((error: Error) => {
    console.error("🚨 Hook Error:", error);
    setError(error);
    
    // 🛡️ REPORT TO ERROR TRACKING
    if (process.env.NODE_ENV === 'production') {
      console.log("Error would be reported to tracking service");
    }
  }, []);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { error, handleError, resetError };
};

export default ErrorBoundary;
