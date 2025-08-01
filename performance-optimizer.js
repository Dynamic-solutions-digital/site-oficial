// Dynamic Solutions Ultra Performance Optimizer
// Sistema proprietário de otimização de performance para GitHub Pages

class UltraPerformanceOptimizer {
    constructor() {
        this.metrics = {
            fcp: 0,
            lcp: 0,
            fid: 0,
            cls: 0,
            ttfb: 0
        };
        
        this.observers = new Map();
        this.resourceHints = new Set();
        this.criticalCSS = new Set();
        this.deferredAssets = [];
        
        this.init();
    }

    init() {
        // Aggressive performance optimizations
        this.injectCriticalCSS();
        this.setupResourceHints();
        this.initServiceWorker();
        this.setupIntelligentPrefetching();
        this.optimizeRendering();
        this.setupPerformanceMonitoring();
        this.implementVirtualScrolling();
        this.optimizeWebFonts();
        this.setupImageOptimization();
        this.initWebWorkers();
    }

    // Critical CSS injection inline
    injectCriticalCSS() {
        const criticalStyles = `
            /* Critical rendering path optimization */
            html{line-height:1.15;-webkit-text-size-adjust:100%}
            body{margin:0;font-family:Inter,sans-serif;background:#000;color:#E5E5E5;overflow-x:hidden}
            .hidden{display:none!important;visibility:hidden!important}
            .loading{opacity:0;transform:translateY(20px)}
            .loaded{opacity:1;transform:translateY(0);transition:opacity .3s,transform .3s}
        `;
        
        const style = document.createElement('style');
        style.textContent = criticalStyles;
        style.setAttribute('data-critical', 'true');
        document.head.insertBefore(style, document.head.firstChild);
    }

    // Advanced resource hints
    setupResourceHints() {
        const hints = [
            { rel: 'preconnect', href: 'https://fonts.googleapis.com', crossorigin: true },
            { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true },
            { rel: 'dns-prefetch', href: '//cdnjs.cloudflare.com' },
            { rel: 'prefetch', href: '/about/index.html' },
            { rel: 'prefetch', href: '/assessment/index.html' },
            { rel: 'preload', href: '/image/Logo oficial.png', as: 'image' }
        ];

        hints.forEach(hint => {
            if (!this.resourceHints.has(hint.href)) {
                const link = document.createElement('link');
                Object.keys(hint).forEach(key => {
                    if (key === 'crossorigin' && hint[key]) {
                        link.setAttribute('crossorigin', '');
                    } else {
                        link.setAttribute(key, hint[key]);
                    }
                });
                document.head.appendChild(link);
                this.resourceHints.add(hint.href);
            }
        });
    }

    // Service Worker registration with error handling
    async initServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js', {
                    scope: '/',
                    updateViaCache: 'none'
                });

                // Handle updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New content available
                            this.showUpdateNotification();
                        }
                    });
                });

                // Message channel for communication
                navigator.serviceWorker.addEventListener('message', event => {
                    this.handleServiceWorkerMessage(event.data);
                });

            } catch (error) {
                console.log('SW registration failed:', error);
            }
        }
    }

    // Intelligent prefetching based on user behavior
    setupIntelligentPrefetching() {
        // Intersection Observer for predictive loading
        const prefetchObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const links = entry.target.querySelectorAll('a[href^="/"], a[href^="./"], a[href^="../"]');
                    links.forEach(link => this.prefetchResource(link.href));
                }
            });
        }, {
            rootMargin: '50px'
        });

        // Observe navigation sections
        document.querySelectorAll('nav, .navigation, .menu').forEach(nav => {
            prefetchObserver.observe(nav);
        });

        // Mouse hover prefetching
        document.addEventListener('mouseover', this.debounce((event) => {
            const link = event.target.closest('a');
            if (link && this.isInternalLink(link.href)) {
                this.prefetchResource(link.href);
            }
        }, 100));

        // Viewport-based prefetching
        window.addEventListener('scroll', this.throttle(() => {
            this.prefetchVisibleLinks();
        }, 200));
    }

    // Rendering optimization
    optimizeRendering() {
        // Prevent layout thrashing
        this.setupLayoutOptimization();
        
        // Optimize animations
        this.optimizeAnimations();
        
        // Setup efficient repaints
        this.setupRepaintOptimization();
        
        // Lazy load non-critical elements
        this.setupLazyLoading();
    }

    setupLayoutOptimization() {
        // Use transform instead of changing layout properties
        const style = document.createElement('style');
        style.textContent = `
            .will-change { will-change: transform, opacity; }
            .gpu-accelerated { transform: translateZ(0); }
        `;
        document.head.appendChild(style);

        // Add classes to animated elements
        document.querySelectorAll('[class*="animate"], [class*="transition"]').forEach(el => {
            el.classList.add('will-change', 'gpu-accelerated');
        });
    }

    optimizeAnimations() {
        // Use RAF for smooth animations
        const animatedElements = document.querySelectorAll('[data-animate]');
        
        if (animatedElements.length > 0) {
            this.setupRAFAnimations(animatedElements);
        }
    }

    setupRAFAnimations(elements) {
        let isAnimating = false;
        
        const animate = () => {
            if (!isAnimating) return;
            
            elements.forEach(element => {
                const rect = element.getBoundingClientRect();
                const inView = rect.top < window.innerHeight && rect.bottom > 0;
                
                if (inView) {
                    element.classList.add('animate-in');
                } else {
                    element.classList.remove('animate-in');
                }
            });
            
            requestAnimationFrame(animate);
        };
        
        const startAnimation = () => {
            if (!isAnimating) {
                isAnimating = true;
                requestAnimationFrame(animate);
            }
        };
        
        const stopAnimation = () => {
            isAnimating = false;
        };
        
        // Start/stop based on visibility
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopAnimation();
            } else {
                startAnimation();
            }
        });
        
        startAnimation();
    }

    setupRepaintOptimization() {
        // Batch DOM reads and writes
        this.readWriteQueue = [];
        this.isFlushingQueue = false;
        
        this.scheduleFlush = () => {
            if (!this.isFlushingQueue) {
                this.isFlushingQueue = true;
                requestAnimationFrame(() => {
                    this.flushQueue();
                    this.isFlushingQueue = false;
                });
            }
        };
    }

    flushQueue() {
        // Separate reads and writes
        const reads = this.readWriteQueue.filter(task => task.type === 'read');
        const writes = this.readWriteQueue.filter(task => task.type === 'write');
        
        // Execute all reads first
        reads.forEach(task => task.fn());
        
        // Then all writes
        writes.forEach(task => task.fn());
        
        this.readWriteQueue = [];
    }

    // Advanced lazy loading
    setupLazyLoading() {
        const lazyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadElement(entry.target);
                    lazyObserver.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '100px',
            threshold: 0.1
        });

        // Observe lazy elements
        document.querySelectorAll('[data-lazy], [loading="lazy"]').forEach(el => {
            lazyObserver.observe(el);
        });
    }

    loadElement(element) {
        if (element.dataset.src) {
            element.src = element.dataset.src;
            element.removeAttribute('data-src');
        }
        
        if (element.dataset.lazy) {
            const content = element.dataset.lazy;
            element.innerHTML = content;
            element.removeAttribute('data-lazy');
        }
        
        element.classList.add('loaded');
    }

    // Performance monitoring
    setupPerformanceMonitoring() {
        // Core Web Vitals
        this.measureCoreWebVitals();
        
        // Custom metrics
        this.measureCustomMetrics();
        
        // Resource timing
        this.monitorResourceTiming();
    }

    measureCoreWebVitals() {
        // First Contentful Paint
        new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const fcp = entries[entries.length - 1];
            this.metrics.fcp = fcp.startTime;
        }).observe({ entryTypes: ['paint'] });

        // Largest Contentful Paint
        new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lcp = entries[entries.length - 1];
            this.metrics.lcp = lcp.startTime;
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay
        new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach(entry => {
                if (entry.name === 'first-input') {
                    this.metrics.fid = entry.processingStart - entry.startTime;
                }
            });
        }).observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift
        let clsScore = 0;
        new PerformanceObserver((list) => {
            list.getEntries().forEach(entry => {
                if (!entry.hadRecentInput) {
                    clsScore += entry.value;
                    this.metrics.cls = clsScore;
                }
            });
        }).observe({ entryTypes: ['layout-shift'] });
    }

    measureCustomMetrics() {
        // Time to First Byte
        const navTiming = performance.getEntriesByType('navigation')[0];
        if (navTiming) {
            this.metrics.ttfb = navTiming.responseStart - navTiming.requestStart;
        }
    }

    monitorResourceTiming() {
        const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach(entry => {
                if (entry.duration > 1000) {
                    console.warn('Slow resource:', entry.name, entry.duration + 'ms');
                }
            });
        });
        
        observer.observe({ entryTypes: ['resource'] });
    }

    // Virtual scrolling for large lists
    implementVirtualScrolling() {
        const lists = document.querySelectorAll('[data-virtual-scroll]');
        
        lists.forEach(list => {
            this.setupVirtualScrolling(list);
        });
    }

    setupVirtualScrolling(container) {
        const items = Array.from(container.children);
        const itemHeight = this.getItemHeight(items[0]);
        const containerHeight = container.clientHeight;
        const visibleCount = Math.ceil(containerHeight / itemHeight) + 2;
        
        let scrollTop = 0;
        let startIndex = 0;
        
        const updateVisibleItems = () => {
            startIndex = Math.floor(scrollTop / itemHeight);
            const endIndex = Math.min(startIndex + visibleCount, items.length);
            
            // Hide all items
            items.forEach((item, index) => {
                if (index < startIndex || index >= endIndex) {
                    item.style.display = 'none';
                } else {
                    item.style.display = '';
                    item.style.transform = `translateY(${index * itemHeight}px)`;
                }
            });
        };
        
        container.addEventListener('scroll', () => {
            scrollTop = container.scrollTop;
            requestAnimationFrame(updateVisibleItems);
        });
        
        updateVisibleItems();
    }

    getItemHeight(item) {
        if (!item) return 50; // default
        const rect = item.getBoundingClientRect();
        return rect.height || 50;
    }

    // Web font optimization
    optimizeWebFonts() {
        // Font display swap
        const fontLinks = document.querySelectorAll('link[href*="fonts.googleapis.com"]');
        fontLinks.forEach(link => {
            const url = new URL(link.href);
            url.searchParams.set('display', 'swap');
            link.href = url.toString();
        });

        // Preload critical fonts
        const criticalFonts = [
            'Inter-400.woff2',
            'Playfair-Display-700.woff2'
        ];
        
        criticalFonts.forEach(font => {
            if (!this.resourceHints.has(font)) {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.href = `/fonts/${font}`;
                link.as = 'font';
                link.type = 'font/woff2';
                link.crossOrigin = '';
                document.head.appendChild(link);
            }
        });
    }

    // Image optimization
    setupImageOptimization() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            // Add loading="lazy" for non-critical images
            if (!img.hasAttribute('loading') && !this.isCriticalImage(img)) {
                img.loading = 'lazy';
            }
            
            // Add intersection observer for fade-in effect
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in');
                        imageObserver.unobserve(entry.target);
                    }
                });
            });
            
            imageObserver.observe(img);
        });
    }

    isCriticalImage(img) {
        const rect = img.getBoundingClientRect();
        return rect.top < window.innerHeight; // Above the fold
    }

    // Web Workers for heavy computation
    initWebWorkers() {
        if ('Worker' in window) {
            this.setupComputationWorker();
        }
    }

    setupComputationWorker() {
        const workerCode = `
            self.onmessage = function(e) {
                const { type, data } = e.data;
                
                switch(type) {
                    case 'HEAVY_COMPUTATION':
                        const result = performHeavyComputation(data);
                        self.postMessage({ type: 'COMPUTATION_RESULT', result });
                        break;
                }
            };
            
            function performHeavyComputation(data) {
                // Heavy computations here
                return data;
            }
        `;
        
        const blob = new Blob([workerCode], { type: 'application/javascript' });
        this.worker = new Worker(URL.createObjectURL(blob));
        
        this.worker.onmessage = (e) => {
            this.handleWorkerMessage(e.data);
        };
    }

    // Utility functions
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    isInternalLink(href) {
        try {
            const url = new URL(href, window.location.origin);
            return url.origin === window.location.origin;
        } catch {
            return false;
        }
    }

    prefetchResource(href) {
        if (!this.resourceHints.has(href) && this.isInternalLink(href)) {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = href;
            document.head.appendChild(link);
            this.resourceHints.add(href);
        }
    }

    prefetchVisibleLinks() {
        const links = document.querySelectorAll('a[href^="/"], a[href^="./"], a[href^="../"]');
        
        links.forEach(link => {
            const rect = link.getBoundingClientRect();
            if (rect.top < window.innerHeight + 200 && rect.bottom > -200) {
                this.prefetchResource(link.href);
            }
        });
    }

    handleServiceWorkerMessage(data) {
        switch(data.type) {
            case 'CACHE_UPDATED':
                console.log('Cache updated for:', data.url);
                break;
        }
    }

    handleWorkerMessage(data) {
        switch(data.type) {
            case 'COMPUTATION_RESULT':
                // Handle computation result
                break;
        }
    }

    showUpdateNotification() {
        // Show subtle update notification
        const notification = document.createElement('div');
        notification.innerHTML = 'Nova versão disponível';
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--quantum-gold);
            color: black;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 10000;
            cursor: pointer;
        `;
        
        notification.onclick = () => {
            window.location.reload();
        };
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    // Public API
    getMetrics() {
        return this.metrics;
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.ultraOptimizer = new UltraPerformanceOptimizer();
    });
} else {
    window.ultraOptimizer = new UltraPerformanceOptimizer();
}