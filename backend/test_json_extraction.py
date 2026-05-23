import json
from app.services.ai_service import _extract_json_from_text

# Test with the actual problematic output from the error log
test_response = """Here is the analysis in a valid JSON object:

{
"performance_issues": ["Longest contentful paint takes 4.9 seconds", "Cumulative layout shift is high at 0.223", "First contentful paint takes 3.7 seconds, but not ideal"],
"seo_impact": ["High LCP and FCP can negatively impact search rankings", "CLS may cause issues with mobile users' scrolling experience", "Slow Speed Index can lead to lower rankings"],
"optimization_suggestions": ["Optimize images and reduce file size", "Use code splitting or lazy loading for large modules", "Minify and compress JavaScript/CSS files"],
"react_optimization_tips": ["Use React Suspense for long-running operations", "Implement memoization for expensive computations", "Consider dynamic imports for large dependencies"],
"caching_recommendations": ["Configure a CDN to serve static assets", "Implement service workers for offline-first experience", "Set Cache-Control headers for efficient caching"],
"image_optimization": ["Convert images to WebP or AVIF format", "Use responsive srcset and lazy loading for images", "Preload the LCP image using the `rel='preconnect'` attribute"]
}"""

try:
    result = _extract_json_from_text(test_response)
    print("✅ JSON Extraction successful!")
    print(f"Keys extracted: {list(result.keys())}")
    print(f"Performance issues count: {len(result.get('performance_issues', []))}")
    print("✅ Test PASSED - Ollama response parsing is fixed!")
except Exception as e:
    print(f"❌ JSON Extraction failed: {e}")
    import traceback
    traceback.print_exc()
