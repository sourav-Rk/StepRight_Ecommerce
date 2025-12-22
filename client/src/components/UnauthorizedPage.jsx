import React from 'react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <svg 
              className="w-8 h-8 text-red-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">403</h1>
          <h2 className="text-2xl font-semibold text-slate-700 mb-4">
            Access Denied
          </h2>
          <p className="text-slate-600 mb-6">
            You don't have permission to access this resource. Please contact your administrator if you believe this is an error.
          </p>
        </div>

        <div className="space-y-3">
          <button 
            onClick={() => window.history.back()}
            className="w-full bg-slate-600 hover:bg-slate-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Go Back
          </button>
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full bg-white hover:bg-slate-50 text-slate-700 font-medium py-2 px-4 rounded-lg border border-slate-300 transition-colors"
          >
            Return to Home
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-200">
          <p className="text-sm text-slate-500">
            Error Code: 403 Forbidden
          </p>
        </div>
      </div>
    </div>
  );
}