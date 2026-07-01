import React, { Component, ErrorInfo, ReactNode } from "react";

interface EBProps {
  children: ReactNode;
  fallback?: ReactNode;
}

// Simple class with bind approach that works with useDefineForClassFields: false
class ErrorBoundaryInner extends Component<any, any> {
  render() {
    const s = (this as any).state || {};
    const p = (this as any).props || {};
    if (s.hasError) {
      if (p.fallback) return p.fallback;
      const { AlertTriangle, RefreshCw } = require("lucide-react");
      return React.createElement("div", { className: "flex flex-col items-center justify-center py-16 px-4 text-center" },
        React.createElement("div", { className: "bg-red-500/10 border border-red-500/20 rounded-2xl p-8 max-w-md w-full" },
          React.createElement(AlertTriangle, { className: "h-10 w-10 text-red-400 mx-auto mb-4" }),
          React.createElement("h3", { className: "text-sm font-bold text-white font-display mb-2" }, "Something went wrong"),
          React.createElement("p", { className: "text-[11px] text-gray-400 font-sans mb-4" }, s.error?.message || "An unexpected error occurred."),
          React.createElement("button", {
            onClick: () => (this as any).setState({ hasError: false, error: null }),
            className: "inline-flex items-center gap-2 bg-brand-teal text-brand-navy px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#00bda0] transition-all"
          }, React.createElement(RefreshCw, { className: "h-3.5 w-3.5" }), " Try Again")
        )
      );
    }
    return p.children;
  }
}

// Wrapper that handles state
export default class ErrorBoundary extends Component<EBProps, { hasError: boolean; error: Error | null }> {
  constructor(props: EBProps) {
    super(props);
    (this as any).state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info);
  }
  
  render() {
    const state = (this as any).state || {};
    const props = (this as any).props || {};
    
    if (state.hasError) {
      if (props.fallback) return props.fallback;
      return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 max-w-md w-full">
            <svg className="h-10 w-10 text-red-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="text-sm font-bold text-white font-display mb-2">Something went wrong</h3>
            <p className="text-[11px] text-gray-400 font-sans mb-4">
              {state.error?.message || "An unexpected error occurred."}
            </p>
            <button
              onClick={() => (this as any).setState({ hasError: false, error: null })}
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
