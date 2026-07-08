import React from 'react';

interface ErrorMessageProps {
  message: string;
  type?: 'rate_limit' | 'fallback' | 'error';
  children?: React.ReactNode;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, type = 'error', children }) => {
  const getStyles = () => {
    switch (type) {
      case 'rate_limit':
        return 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900/30 text-orange-800 dark:text-orange-300';
      case 'fallback':
        return 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'error':
      default:
        return 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/30 text-red-800 dark:text-red-300';
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'rate_limit':
        return 'Daily Limit Reached';
      case 'fallback':
        return 'Basic Matching Active';
      case 'error':
      default:
        return 'Error';
    }
  };

  return (
    <div className={`mt-6 p-6 rounded-md border ${getStyles()} max-w-md w-full text-center mx-auto transition-colors duration-200`}>
      <h3 className="font-bold text-lg mb-2">{getTitle()}</h3>
      <p className={children ? 'mb-4 text-sm' : 'text-sm font-medium'}>
        {message}
      </p>
      {children && (
        <div className="text-sm font-mono bg-white dark:bg-stone-900 bg-opacity-50 dark:bg-opacity-50 py-2 px-4 rounded">
          {children}
        </div>
      )}
    </div>
  );
};

export default ErrorMessage;
