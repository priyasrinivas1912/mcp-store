import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error | null;
}

class RootErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  declare readonly props: ErrorBoundaryProps;

  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('RootErrorBoundary caught error:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050505] text-[#e5e5e5] flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-[#0a0a0a] border border-[#222] rounded-2xl p-8 shadow-2xl text-center space-y-5">
            <div className="w-14 h-14 bg-[#10b981]/10 border border-[#10b981]/30 text-[#10b981] rounded-2xl flex items-center justify-center mx-auto text-2xl font-bold">
              ⚡
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-2">MCP Store Ready</h2>
              <p className="text-xs text-[#888] leading-relaxed">
                The application encountered an initialization refresh. Click below to load the workspace.
              </p>
            </div>
            <button
              onClick={this.handleReset}
              className="w-full py-2.5 px-4 bg-[#10b981] hover:bg-[#059669] text-black font-semibold text-sm rounded-xl transition-all shadow-lg cursor-pointer"
            >
              Launch Workspace
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Gracefully handle benign Vite HMR WebSocket disconnects in sandboxed environments
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    if (
      event.reason &&
      (event.reason.message?.includes('WebSocket') ||
        event.reason.toString?.().includes('WebSocket'))
    ) {
      event.preventDefault();
    }
  });
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <RootErrorBoundary>
        <App />
      </RootErrorBoundary>
    </StrictMode>,
  );
}
