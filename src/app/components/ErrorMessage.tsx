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
        return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'fallback':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'error':
      default:
        return 'bg-red-50 border-red-200 text-red-800';
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
    <div className={`mt-6 p-6 rounded-md border ${getStyles()} max-w-md w-full text-center mx-auto`}>
      <h3 className="font-bold text-lg mb-2">{getTitle()}</h3>
      <p className={children ? 'mb-4 text-sm' : 'text-sm font-medium'}>
        {message}
      </p>
      {children && (
        <div className="text-sm font-mono bg-white bg-opacity-50 py-2 px-4 rounded">
          {children}
        </div>
      )}
    </div>
  );
};

export default ErrorMessage;
