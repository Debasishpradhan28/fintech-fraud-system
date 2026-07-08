import React from 'react';

interface AccessDeniedProps {
  /** The URL to redirect the user to when clicking "Return to Home". Defaults to "/" */
  homeUrl?: string;
  /** Optional custom error message */
  message?: string;
}

const AccessDenied: React.FC<AccessDeniedProps> = ({ 
  homeUrl = '/', 
  message = "You do not have the necessary permissions to view this page. Please contact your administrator if you believe this is a mistake." 
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 text-center border border-gray-100">
        
        {/* Lock / Shield Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-red-50 rounded-full">
            <svg 
              className="w-16 h-16 text-red-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
              />
            </svg>
          </div>
        </div>

        {/* Error Text */}
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-3">
          Access Denied
        </h1>
        <p className="text-base text-gray-500 mb-8 leading-relaxed">
          {message}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors"
          >
            Go Back
          </button>
          <a
            href={homeUrl}
            className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors inline-block"
          >
            Return to Home
          </a>
        </div>
        
      </div>
    </div>
  );
};

export default AccessDenied;