# Ollama Logging Guide 📊

Complete logging has been added to track Ollama status at every stage. Here's what to look for:

## Log Flow & What It Means

### 1. **API Request Starts** 🔵
```
[API] 🔵 NEW ANALYSIS REQUEST
[API] URL: https://example.com
[API] Step 1/2: Fetching PageSpeed metrics...
```
✅ Your request has been received

### 2. **PageSpeed API Call** 🔷
```
[PAGESPEED API] 🔷 Starting PageSpeed Insights fetch
[PAGESPEED API] URL: https://example.com
[PAGESPEED STAGE 2] Making request to Google PageSpeed API...
[PAGESPEED STAGE 4] Parsing JSON response...
[PAGESPEED] ✅ API request successful
```
✅ Metrics are being fetched from Google

### 3. **Metrics Parsing** 📊
```
[PARSE METRICS] Extracting core metrics...
[PARSE METRICS] ✅ Metrics parsed successfully:
[PARSE METRICS]   - Performance Score: 75 (Good)
[PARSE METRICS]   - LCP: 2.5s
[PARSE METRICS]   - CLS: 0.1
[PARSE METRICS]   - FCP: 1.2s
[PARSE METRICS]   - Speed Index: 3.1s
[PARSE METRICS]   - TBT: 150ms
```
✅ Metrics are ready for Ollama

### 4. **Ollama Analysis Starts** 🚀
```
[OLLAMA ANALYSIS] 🚀 Starting new analysis request
[OLLAMA ANALYSIS] Model: qwen3:4b
[OLLAMA STAGE 1] Starting Ollama call
[OLLAMA STAGE 1] Using model: qwen3:4b
[OLLAMA STAGE 1] Ollama host: http://localhost:11434
[OLLAMA STAGE 2] Prompt formatted successfully (length: 850 chars)
```
✅ Ollama is being called

### 5. **Ollama Processing** ⚙️
```
[OLLAMA STAGE 3] Sending request to Ollama model 'qwen3:4b'...
[OLLAMA STAGE 4] ✅ Ollama response received successfully
```
✅ Ollama is responding and thinking

### 6. **Response Parsing** 🔍
```
[OLLAMA STAGE 5] Raw response received (length: 1203 chars)
[OLLAMA STAGE 6] Extracting JSON object...
[OLLAMA STAGE 7] Parsing JSON response...
[OLLAMA STAGE 7] ✅ JSON parsed successfully
[OLLAMA STAGE 7] Parsed keys: ['performance_issues', 'seo_impact', ...]
```
✅ Response is valid JSON

### 7. **Normalization** ✨
```
[OLLAMA NORMALIZE] Normalizing suggestions from Ollama response...
[OLLAMA NORMALIZE] Normalized data:
[OLLAMA NORMALIZE]   - performance_issues: 4 items
[OLLAMA NORMALIZE]   - seo_impact: 5 items
[OLLAMA NORMALIZE]   - optimization_suggestions: 4 items
```
✅ Data is ready to send to frontend

### 8. **Success** 🎉
```
[API] ✅ AI analysis completed successfully
[API] 🎉 ANALYSIS COMPLETE - All systems working!
```
✅ **Everything is working!**

---

## ⚠️ Error Scenarios

### **Ollama Not Running**
```
[OLLAMA STAGE 3] ❌ Exception occurred: ConnectionError: ...
[OLLAMA STAGE 3] Connection error - Ollama server not responding at http://localhost:11434
[API] ❌ Ollama Connection Error: Cannot connect to Ollama...
```
🔧 **Fix:** Run `ollama serve` in a new terminal

### **Not Enough Memory**
```
[OLLAMA STAGE 3] ❌ Exception occurred: ResponseError: ...
[OLLAMA STAGE 3] Memory error - Model requires more memory than available
```
🔧 **Fix:** Already fixed! Using qwen3:4b instead of llama3 ✅

### **Model Not Found**
```
[OLLAMA STAGE 3] ❌ Exception occurred: ResponseError: ...
[OLLAMA STAGE 3] Model not found - 'qwen3:4b' is not loaded
```
🔧 **Fix:** Run `ollama pull qwen3:4b`

### **Invalid JSON from Ollama**
```
[OLLAMA STAGE 7] ❌ JSON parsing failed: ...
[OLLAMA STAGE 7] Raw content: {malformed json}
```
🔧 **Fix:** This is rare - Ollama may have been interrupted. Retry.

### **PageSpeed API Error**
```
[PAGESPEED] ❌ HTTP error: 403
[API] ❌ PageSpeed API HTTP error: 403
```
🔧 **Fix:** Check your Google PageSpeed API key in `.env`

---

## 🔧 How to View Logs

### **While Backend is Running**
```bash
# Terminal 1: Backend logs
cd backend
uvicorn app.main:app --reload

# Logs will appear in Terminal 1
```

### **Backend Output Example**
```
INFO:     Application startup complete
INFO:     Uvicorn running on http://127.0.0.1:8000

[API] 🔵 NEW ANALYSIS REQUEST
[API] URL: https://example.com
[PAGESPEED API] 🔷 Starting PageSpeed Insights fetch
...
[API] 🎉 ANALYSIS COMPLETE - All systems working!
```

---

## ✅ What "All Systems Working" Looks Like

You should see this complete flow:

```
[API] 🔵 NEW ANALYSIS REQUEST
   ↓
[PAGESPEED API] 🔷 Starting PageSpeed Insights fetch
[PAGESPEED] ✅ API request successful
[PARSE METRICS] ✅ Metrics parsed successfully
   ↓
[OLLAMA ANALYSIS] 🚀 Starting new analysis request
[OLLAMA STAGE 3] Sending request to Ollama model 'qwen3:4b'...
[OLLAMA STAGE 4] ✅ Ollama response received successfully
[OLLAMA STAGE 7] ✅ JSON parsed successfully
[OLLAMA NORMALIZE] ✅ Data normalized
   ↓
[API] 🎉 ANALYSIS COMPLETE - All systems working!
```

---

## 📌 Quick Status Check

| Stage | Success Log | Error Log |
|-------|---|---|
| API | `[API] 🔵 NEW ANALYSIS REQUEST` | `[API] ❌ ...` |
| PageSpeed | `[PAGESPEED] ✅ API request successful` | `[PAGESPEED] ❌ ...` |
| Parsing | `[PARSE METRICS] ✅ Metrics parsed` | `[PARSE METRICS] ❌ ...` |
| Ollama | `[OLLAMA STAGE 4] ✅ response received` | `[OLLAMA STAGE 3] ❌ ...` |
| JSON | `[OLLAMA STAGE 7] ✅ JSON parsed` | `[OLLAMA STAGE 7] ❌ ...` |
| Complete | `[API] 🎉 ANALYSIS COMPLETE` | `[API] ❌ ...` |

---

## 🎯 Testing

Test the full flow:

```bash
# 1. Make sure Ollama is running
ollama serve  # (in another terminal)

# 2. Start backend
cd backend
uvicorn app.main:app --reload

# 3. In frontend or API tool, send request:
# POST http://localhost:8000/api/analyze
# {
#   "url": "https://www.google.com"
# }

# 4. Watch the logs in the backend terminal!
```

---

**Now you can track Ollama's status at every step! 🎉**
