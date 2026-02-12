import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    this.setState({ error, info });
    console.error('Unhandled render error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 p-6">
          <div className="max-w-3xl bg-white rounded-lg shadow p-6 border border-red-200">
            <h2 className="text-xl font-bold text-red-700">Something went wrong</h2>
            <p className="mt-2 text-sm text-red-600">An unexpected error occurred while rendering the application.</p>
            <div className="mt-4 text-xs text-gray-700">
              <strong>Error:</strong>
              <pre className="whitespace-pre-wrap text-sm mt-2 bg-gray-100 p-3 rounded">{this.state.error?.toString()}</pre>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              Open the browser console for full stack trace.
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
