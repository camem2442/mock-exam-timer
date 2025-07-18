// 성능 모니터링 유틸리티
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // 페이지 로드 시간 측정
  measurePageLoad(): void {
    if (typeof window !== 'undefined' && 'performance' in window) {
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
          const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
          
          this.metrics.set('pageLoadTime', loadTime);
          this.metrics.set('domContentLoaded', domContentLoaded);
          
          console.log(`Page Load Time: ${loadTime}ms`);
          console.log(`DOM Content Loaded: ${domContentLoaded}ms`);
        }
      });
    }
  }

  // 메모리 사용량 측정
  measureMemory(): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      console.log(`Memory Usage: ${Math.round(memory.usedJSHeapSize / 1048576)}MB`);
      console.log(`Memory Limit: ${Math.round(memory.jsHeapSizeLimit / 1048576)}MB`);
    }
  }

  // 네트워크 상태 측정
  measureNetwork(): void {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      console.log(`Network Type: ${connection.effectiveType}`);
      console.log(`Downlink: ${connection.downlink}Mbps`);
      console.log(`RTT: ${connection.rtt}ms`);
    }
  }

  // 터치 반응성 측정
  measureTouchResponsiveness(): void {
    let touchStartTime = 0;
    let touchEndTime = 0;

    document.addEventListener('touchstart', () => {
      touchStartTime = performance.now();
    }, { passive: true });

    document.addEventListener('touchend', () => {
      touchEndTime = performance.now();
      const responseTime = touchEndTime - touchStartTime;
      console.log(`Touch Response Time: ${responseTime}ms`);
    }, { passive: true });
  }

  // 모든 메트릭 수집
  collectAllMetrics(): Record<string, number> {
    this.measureMemory();
    this.measureNetwork();
    
    return Object.fromEntries(this.metrics);
  }
}

// 모바일 최적화 체크리스트
export const checkMobileOptimization = (): Record<string, boolean> => {
  const checks = {
    viewport: false,
    touchTargets: false,
    fontSize: false,
    scrollPerformance: false,
    imageOptimization: false,
    caching: false,
    compression: false,
  };

  // Viewport 체크
  const viewport = document.querySelector('meta[name="viewport"]');
  checks.viewport = !!viewport && viewport.getAttribute('content')?.includes('width=device-width');

  // 터치 타겟 체크 (44px 이상)
  const buttons = document.querySelectorAll('button, [role="button"], .btn');
  const smallButtons = Array.from(buttons).filter(btn => {
    const rect = btn.getBoundingClientRect();
    return rect.width < 44 || rect.height < 44;
  });
  checks.touchTargets = smallButtons.length === 0;

  // 폰트 크기 체크 (16px 이상)
  const bodyFontSize = parseFloat(getComputedStyle(document.body).fontSize);
  checks.fontSize = bodyFontSize >= 16;

  // 스크롤 성능 체크
  const scrollableElements = document.querySelectorAll('.overflow-y-auto, .overflow-x-auto');
  checks.scrollPerformance = Array.from(scrollableElements).every(el => 
    getComputedStyle(el).webkitOverflowScrolling === 'touch'
  );

  // 이미지 최적화 체크
  const images = document.querySelectorAll('img');
  checks.imageOptimization = Array.from(images).every(img => 
    img.hasAttribute('loading') || img.hasAttribute('srcset')
  );

  // 캐싱 체크
  checks.caching = 'serviceWorker' in navigator;

  // 압축 체크 (서버에서 확인 필요)
  checks.compression = true; // 기본값

  return checks;
};

// 성능 경고 표시
export const showPerformanceWarnings = (): void => {
  const checks = checkMobileOptimization();
  const warnings = [];

  if (!checks.viewport) warnings.push('Viewport 메타태그가 최적화되지 않았습니다.');
  if (!checks.touchTargets) warnings.push('일부 터치 타겟이 44px 미만입니다.');
  if (!checks.fontSize) warnings.push('폰트 크기가 16px 미만입니다.');
  if (!checks.scrollPerformance) warnings.push('스크롤 성능이 최적화되지 않았습니다.');
  if (!checks.imageOptimization) warnings.push('이미지 최적화가 필요합니다.');
  if (!checks.caching) warnings.push('Service Worker가 없습니다.');

  if (warnings.length > 0) {
    console.warn('모바일 최적화 경고:', warnings);
  } else {
    console.log('✅ 모바일 최적화가 잘 되어 있습니다!');
  }
};