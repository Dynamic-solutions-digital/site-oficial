// Dynamic Solutions Ultra Performance Service Worker
// Arquitectura de cache inteligente para sites de alta performance

const CACHE_VERSION = 'v1.2024';
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-${CACHE_VERSION}`;
const CRITICAL_CACHE = `critical-${CACHE_VERSION}`;

// Cache strategies por tipo de recurso
const CACHE_STRATEGIES = {
    // Recursos críticos - cache primeiro, network fallback
    critical: [
        '/',
        '/index.html',
        '/home/index.html',
        '/about/index.html',
        '/assessment/index.html',
        '/strategic-assessment-new/index.html',
        '/capabilities/index.html',
        '/analytics-dashboard/index.html'
    ],
    // Recursos estáticos - cache with network update
    static: [
        '/about/neural-sales-system.html'
    ],
    // Recursos externos - stale while revalidate
    external: [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com',
        'https://cdnjs.cloudflare.com'
    ]
};

// Estratégia de precaching inteligente
const PRECACHE_URLS = [
    ...CACHE_STRATEGIES.critical,
    '/image/Logo oficial.png'
];

// Network-first com timeout para GitHub Pages
const NETWORK_TIMEOUT = 3000;

// Install event - aggressive precaching
self.addEventListener('install', event => {
    console.log('[SW] Installing with aggressive caching strategy');
    
    event.waitUntil(
        Promise.all([
            // Cache crítico
            caches.open(CRITICAL_CACHE).then(cache => {
                return cache.addAll(PRECACHE_URLS);
            }),
            // Preload critical resources
            preloadCriticalResources(),
            // Skip waiting para ativação imediata
            self.skipWaiting()
        ])
    );
});

// Activate event - limpar caches antigos
self.addEventListener('activate', event => {
    console.log('[SW] Activating with cache cleanup');
    
    event.waitUntil(
        Promise.all([
            // Limpar caches antigos
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames
                        .filter(cacheName => {
                            return !cacheName.includes(CACHE_VERSION);
                        })
                        .map(cacheName => caches.delete(cacheName))
                );
            }),
            // Claim todos os clients
            self.clients.claim(),
            // Warm up cache
            warmupCache()
        ])
    );
});

// Fetch event - estratégias avançadas de cache
self.addEventListener('fetch', event => {
    const request = event.request;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') return;
    
    // Skip chrome extensions
    if (url.protocol === 'chrome-extension:') return;
    
    // Skip analytics
    if (url.hostname.includes('google-analytics')) return;
    
    event.respondWith(handleRequest(request));
});

async function handleRequest(request) {
    const url = new URL(request.url);
    
    // Estratégia para recursos críticos - Cache First com Network Update
    if (CACHE_STRATEGIES.critical.some(path => url.pathname === path || url.pathname.endsWith(path))) {
        return cacheFirstStrategy(request, CRITICAL_CACHE);
    }
    
    // Estratégia para recursos estáticos - Stale While Revalidate
    if (request.destination === 'style' || request.destination === 'script' || request.destination === 'image') {
        return staleWhileRevalidateStrategy(request, STATIC_CACHE);
    }
    
    // Estratégia para recursos externos - Network First com Cache Fallback
    if (!url.hostname.includes(location.hostname)) {
        return networkFirstStrategy(request, DYNAMIC_CACHE);
    }
    
    // Default - Network First
    return networkFirstStrategy(request, DYNAMIC_CACHE);
}

// Cache First Strategy - Para páginas críticas
async function cacheFirstStrategy(request, cacheName) {
    try {
        const cache = await caches.open(cacheName);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            // Background update
            updateCacheInBackground(request, cache);
            return cachedResponse;
        }
        
        // Se não tem cache, buscar na network
        const networkResponse = await fetchWithTimeout(request);
        cache.put(request.clone(), networkResponse.clone());
        return networkResponse;
        
    } catch (error) {
        console.log('[SW] Cache first failed:', error);
        return new Response('Offline', { status: 503 });
    }
}

// Stale While Revalidate Strategy - Para assets estáticos
async function staleWhileRevalidateStrategy(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    // Sempre tentar buscar versão atualizada
    const networkResponsePromise = fetchWithTimeout(request)
        .then(response => {
            cache.put(request.clone(), response.clone());
            return response;
        })
        .catch(() => cachedResponse);
    
    // Retornar cache imediatamente se disponível
    return cachedResponse || networkResponsePromise;
}

// Network First Strategy - Para conteúdo dinâmico
async function networkFirstStrategy(request, cacheName) {
    try {
        const networkResponse = await fetchWithTimeout(request, NETWORK_TIMEOUT);
        
        // Cache successful responses
        if (networkResponse.status === 200) {
            const cache = await caches.open(cacheName);
            cache.put(request.clone(), networkResponse.clone());
        }
        
        return networkResponse;
        
    } catch (error) {
        // Fallback para cache
        const cache = await caches.open(cacheName);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        throw error;
    }
}

// Fetch com timeout para evitar hang
function fetchWithTimeout(request, timeout = 5000) {
    return Promise.race([
        fetch(request),
        new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Network timeout')), timeout)
        )
    ]);
}

// Update cache em background
function updateCacheInBackground(request, cache) {
    fetch(request)
        .then(response => {
            if (response.status === 200) {
                cache.put(request.clone(), response.clone());
            }
        })
        .catch(() => {
            // Silently fail background updates
        });
}

// Preload critical resources
async function preloadCriticalResources() {
    // Preload fonts
    const fonts = [
        'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&display=swap',
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
    ];
    
    const cache = await caches.open(STATIC_CACHE);
    
    return Promise.all(
        fonts.map(url => 
            fetch(url, { mode: 'cors' })
                .then(response => cache.put(url, response))
                .catch(() => {})
        )
    );
}

// Warm up cache com recursos mais prováveis
async function warmupCache() {
    const criticalPages = [
        '/about/index.html',
        '/assessment/index.html'
    ];
    
    const cache = await caches.open(CRITICAL_CACHE);
    
    return Promise.all(
        criticalPages.map(url => 
            fetch(url)
                .then(response => cache.put(url, response))
                .catch(() => {})
        )
    );
}

// Message handling para comunicação com páginas
self.addEventListener('message', event => {
    if (event.data && event.data.type) {
        switch(event.data.type) {
            case 'SKIP_WAITING':
                self.skipWaiting();
                break;
            case 'CACHE_PAGE':
                cachePage(event.data.url);
                break;
            case 'PREFETCH_ROUTES':
                prefetchRoutes(event.data.routes);
                break;
        }
    }
});

// Cache específico de página
async function cachePage(url) {
    const cache = await caches.open(DYNAMIC_CACHE);
    try {
        const response = await fetch(url);
        await cache.put(url, response);
    } catch (error) {
        console.log('[SW] Failed to cache page:', url);
    }
}

// Prefetch de rotas baseado em comportamento do usuário
async function prefetchRoutes(routes) {
    const cache = await caches.open(CRITICAL_CACHE);
    
    return Promise.all(
        routes.map(route => 
            fetch(route)
                .then(response => cache.put(route, response))
                .catch(() => {})
        )
    );
}