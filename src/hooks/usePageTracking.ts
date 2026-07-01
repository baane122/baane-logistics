import { useEffect, useRef } from "react";

interface PerfMetrics {
  fcp: number | null;
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  ttfb: number | null;
}

export function usePageTracking(pageName: string) {
  const metrics = useRef<PerfMetrics>({
    fcp: null, lcp: null, fid: null, cls: null, ttfb: null,
  });

  useEffect(() => {
    if (performance.getEntriesByType) {
      const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
      if (nav) {
        metrics.current.ttfb = Math.round(nav.responseStart - nav.requestStart);
      }
    }

    if (typeof PerformanceObserver !== "undefined") {
      const paintObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === "first-contentful-paint") {
            metrics.current.fcp = Math.round(entry.startTime);
          }
          if (entry.name === "largest-contentful-paint") {
            metrics.current.lcp = Math.round(entry.startTime);
          }
        }
      });
      try { paintObserver.observe({ type: "paint", buffered: true }); } catch {}
      try { paintObserver.observe({ type: "largest-contentful-paint", buffered: true }); } catch {}

      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            metrics.current.cls = (metrics.current.cls || 0) + (entry as any).value;
          }
        }
      });
      try { clsObserver.observe({ type: "layout-shift", buffered: true }); } catch {}

      return () => {
        paintObserver.disconnect();
        clsObserver.disconnect();
        if (process.env.NODE_ENV === "development") {
          console.log(`[Perf] ${pageName}:`, metrics.current);
        }
      };
    }
  }, [pageName]);

  return metrics.current;
}
