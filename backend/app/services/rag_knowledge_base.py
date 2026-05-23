"""
RAG (Retrieval-Augmented Generation) Knowledge Base for SEO and Performance Optimization.
Provides context-aware suggestions based on Core Web Vitals metrics.
"""

# Knowledge base organized by metric thresholds and suggestions
KNOWLEDGE_BASE = {
    "performance_issues": {
        "lcp_high": [
            "LCP > 4s: Largest Contentful Paint is too slow, indicating server response issues or large image/video loading",
            "LCP > 2.5s: Contentful element is taking too long to render, affecting perceived performance",
            "LCP 1.8-2.5s: Within good range but can be optimized further",
        ],
        "cls_high": [
            "CLS > 0.1: Layout shifts are significantly impacting user experience and page stability",
            "CLS 0.05-0.1: Minor but noticeable layout instability detected",
            "CLS caused by: Dynamic content insertion, unoptimized ads, or images without dimensions",
        ],
        "fcp_high": [
            "FCP > 3s: Users must wait too long to see first visual feedback",
            "FCP > 1.8s: Slower than optimal, impacting user perception",
        ],
        "speed_index_high": [
            "Speed Index > 4s: Overall rendering performance is slow",
            "Speed Index indicates: Content is rendering progressively but slower than expected",
        ],
        "tbt_high": [
            "TBT > 200ms: JavaScript is blocking user interactions",
            "TBT > 50ms: Noticeable delay in input responsiveness",
        ],
        "low_score": [
            "Performance score below 50: Critical issues need immediate attention",
            "Performance score 50-75: Multiple optimization opportunities available",
            "Performance score 75-90: Good performance with room for improvement",
        ],
    },
    "seo_impact": {
        "core_web_vitals": [
            "Core Web Vitals are Google ranking factors affecting search visibility",
            "Poor LCP and CLS directly impact SEO rankings and bounce rates",
            "Page Experience signals influence search result positioning and CTR",
            "Mobile Core Web Vitals are especially critical for mobile search rankings",
        ],
        "specific_impacts": [
            "Slow FCP/LCP increases bounce rate, reducing dwell time metric",
            "Layout shifts (CLS) frustrate users, increasing exit rates",
            "Slow response time affects crawlability of dynamic content",
        ],
    },
    "optimization_suggestions": {
        "image_optimization": [
            "Optimize images: use WebP/AVIF format, compress with ImageOptim or TinyPNG",
            "Implement responsive images with srcset for different screen sizes",
            "Lazy load below-the-fold images using loading='lazy' attribute",
            "Preload LCP images with rel='preconnect' to origin server",
            "Use CDN for image delivery to reduce latency and response time",
        ],
        "javascript_optimization": [
            "Code splitting: Break large JS bundles into smaller chunks loaded on-demand",
            "Lazy loading: Use dynamic imports() for non-critical features",
            "Defer non-critical JavaScript with async/defer attributes",
            "Remove unused CSS and JavaScript from critical rendering path",
            "Minify and compress JavaScript files for smaller downloads",
        ],
        "server_optimization": [
            "Reduce TTFB (Time to First Byte): Optimize server response and database queries",
            "Enable GZIP compression on server to reduce file sizes by 60-80%",
            "Implement caching headers to reduce redundant requests",
            "Use CDN for static assets to serve from edge locations",
        ],
        "css_optimization": [
            "Inline critical CSS needed for above-the-fold content",
            "Defer non-critical CSS or load asynchronously",
            "Remove unused CSS selectors and consolidate stylesheets",
            "Use CSS minification to reduce file size",
        ],
        "other": [
            "Reduce third-party script impact: defer analytics, ads, and trackers",
            "Implement Progressive Enhancement for better perceived performance",
            "Use HTTP/2 Server Push for critical resources",
            "Enable compression and caching for optimal delivery",
        ],
    },
    "react_optimization_tips": {
        "rendering": [
            "React.memo() for pure components to prevent unnecessary re-renders",
            "useMemo() for expensive calculations and object creation",
            "useCallback() to memoize functions and prevent child re-renders",
            "Code splitting with React.lazy() and Suspense for route-based splitting",
            "Virtual scrolling for long lists using react-window or react-virtualized",
        ],
        "bundle": [
            "Dynamic imports with dynamic import() for feature/route-based code splitting",
            "Tree-shaking: Remove unused exports by using ES6 modules",
            "Bundle analysis with webpack-bundle-analyzer to identify large modules",
            "Use production builds: Remove React warnings and enable optimizations",
        ],
        "performance": [
            "Reduce bundle size: Replace heavy libraries with lighter alternatives",
            "Suspense boundaries for graceful loading states and error handling",
            "Avoid inline functions in event handlers to prevent re-renders",
            "Profile with React DevTools Profiler to identify slow components",
            "Use Profiler API to track component render times in production",
        ],
    },
    "caching_recommendations": {
        "http_caching": [
            "Cache-Control: max-age=31536000 for immutable assets (hashed filenames)",
            "Cache-Control: max-age=3600 for HTML and dynamic content",
            "stale-while-revalidate: Serve stale content while revalidating in background",
            "ETag and Last-Modified headers for conditional requests to save bandwidth",
        ],
        "cdn": [
            "Use CDN (Cloudflare, CloudFront, Fastly) for global content distribution",
            "CDN reduces latency by serving from edge locations near users",
            "Enable CDN compression and automatic image optimization",
            "Point domain DNS to CDN for full content acceleration",
        ],
        "browser_storage": [
            "Service Workers for offline support and advanced caching strategies",
            "IndexedDB for large client-side data storage and sync",
            "LocalStorage for user preferences and non-critical data",
            "Session Storage for temporary data during user session",
        ],
        "api_caching": [
            "API response caching with Cache-Control headers",
            "Implement data sync strategies to reduce API requests",
            "Use GraphQL field-level caching for selective data fetching",
        ],
    },
    "image_optimization": {
        "formats": [
            "WebP format for 25-35% size reduction vs JPEG (fallback to JPEG)",
            "AVIF format for 50%+ size reduction but check browser compatibility",
            "SVG for icons and simple graphics for scalability without quality loss",
            "JPEG for photographs, PNG for images with transparency",
        ],
        "techniques": [
            "Responsive images with srcset and sizes for device-specific serving",
            "Lazy loading images below-the-fold to defer loading until visible",
            "Image compression with tinypng.com, ImageOptim, or Squoosh",
            "Use aspect-ratio CSS to prevent layout shifts when images load",
            "Preload LCP images with <link rel='preload' as='image'>",
        ],
        "advanced": [
            "Adaptive image serving based on network speed (Save-Data header)",
            "Picture element with multiple sources for format negotiation",
            "Image sprites for multiple small images to reduce requests",
            "Cloudinary or Imgix for dynamic image optimization and delivery",
        ],
    },
}


def get_relevant_suggestions(metrics: dict) -> dict:
    """
    Use RAG to retrieve relevant suggestions based on current metrics.
    This helps the AI model with better context-aware recommendations.
    """
    relevant = {
        "performance_context": [],
        "seo_context": [],
        "optimization_context": [],
    }
    
    # Analyze LCP
    lcp_value = float(metrics.get("lcp", "0").rstrip("s"))
    if lcp_value > 4:
        relevant["performance_context"].extend(KNOWLEDGE_BASE["performance_issues"]["lcp_high"][:1])
    elif lcp_value > 2.5:
        relevant["performance_context"].extend(KNOWLEDGE_BASE["performance_issues"]["lcp_high"][1:2])
    
    # Analyze CLS
    cls_value = float(metrics.get("cls", "0").rstrip("s"))
    if cls_value > 0.1:
        relevant["performance_context"].extend(KNOWLEDGE_BASE["performance_issues"]["cls_high"][:1])
    elif cls_value > 0.05:
        relevant["performance_context"].extend(KNOWLEDGE_BASE["performance_issues"]["cls_high"][1:2])
    
    # Analyze FCP
    fcp_value = float(metrics.get("fcp", "0").rstrip("s"))
    if fcp_value > 3:
        relevant["performance_context"].append(KNOWLEDGE_BASE["performance_issues"]["fcp_high"][0])
    
    # Analyze performance score
    score = metrics.get("performance_score", 0)
    if score < 50:
        relevant["seo_context"].extend(KNOWLEDGE_BASE["seo_impact"]["core_web_vitals"][:2])
    
    # Add optimization context
    relevant["optimization_context"] = (
        KNOWLEDGE_BASE["optimization_suggestions"]["image_optimization"][:2] +
        KNOWLEDGE_BASE["optimization_suggestions"]["javascript_optimization"][:2]
    )
    
    return relevant


def get_rag_context(metrics: dict) -> str:
    """
    Generate RAG context string to augment the prompt with relevant knowledge.
    """
    suggestions = get_relevant_suggestions(metrics)
    
    context = "\nCONTEXT FROM KNOWLEDGE BASE:\n"
    if suggestions["performance_context"]:
        context += "Known Performance Issues:\n"
        for item in suggestions["performance_context"][:2]:
            context += f"- {item}\n"
    
    if suggestions["seo_context"]:
        context += "\nSEO Impact:\n"
        for item in suggestions["seo_context"][:2]:
            context += f"- {item}\n"
    
    if suggestions["optimization_context"]:
        context += "\nProven Optimization Techniques:\n"
        for item in suggestions["optimization_context"][:3]:
            context += f"- {item}\n"
    
    return context
