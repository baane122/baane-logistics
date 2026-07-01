import { Component, ErrorInfo, ReactNode } from "react";

interface EBProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, info: ErrorInfo) => void;
}

// Using Component with Object.assign pattern for useDefineForClassFields: false compatibility
export default class ErrorBoundary extends Component {
  constructor(props: EBProps) {
    super(props);
    (this as any).state = { hasError: false, error: null };
    (this as any).handleRetry = () => {
      (this as any).setState({ hasError: false, error: null });
    };
  }
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("[ErrorBoundary]", error, info);
  }
  
  render(): ReactNode {
    const state: EBState = (this as any).state || {};
    const props: EBProps = (this as any).props || {};
    
    if (state.hasError) {
      if (props.fallback) return props.fallback;
      return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 max-w-md w-full">
            <svg className="h-10 w-10 text-red-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5" />
            </svg>
            <h3 className="text-sm font-bold text-white font-display mb-2">Something went wrong</h3>
            <p className="text-[11px] text-gray-400 font-sans mb-4">
              {state.error?.message || "An unexpected error occurred."}
            </p>
            <button
              onClick={(this as any).handleRetry}
              className="inline-flex items-center gap-2 bg-brand-teal text-brand-navy px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#00bda0] transition-all"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Try Again
            </button>
          </div>
        </div>
      );
    }
    return props.children;
  }
}

interface EBState {
  hasError: boolean;
  error: Error | null;
}
