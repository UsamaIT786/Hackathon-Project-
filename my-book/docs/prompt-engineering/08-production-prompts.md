---
title: "Production Prompts and Systems"
description: "Deploy prompts reliably in production systems."
keywords:
  - "production"
  - "reliability"
  - "monitoring"
  - "deployment"
---

# Production Prompts and Systems

## Overview

Moving from experimentation to production requires different thinking. This chapter covers building reliable, maintainable, and scalable prompt-based systems.

## Production Requirements

### Reliability

```
Experimentation:
- Run once, check if it works
- Acceptable: 70% accuracy
- Failure: Try again manually

Production:
- Must run 24/7
- Acceptable: 99%+ accuracy required
- Failure: Customers affected, costs money
- Rollback needed within minutes
```

### Monitoring

```
Experimentation:
- Manually check outputs
- Ad-hoc evaluation
- No logging required

Production:
- Automated quality metrics
- Real-time alerts
- Complete audit trail
- Performance dashboards
```

### Maintainability

```
Experimentation:
- Single prompt in notebook
- No documentation
- Iterative changes

Production:
- Versioned prompts
- Documentation per version
- Change control process
- Impact analysis before changes
```

## Production Architecture

### System Design

```
┌─────────────────┐
│   User Input    │
└────────┬────────┘
         │
    ┌────▼────┐
    │ Validate │  Ensure input meets requirements
    └────┬────┘
         │
    ┌────▼────────────┐
    │ Build Prompt    │  Assemble prompt with context
    └────┬────────────┘
         │
    ┌────▼──────────────┐
    │ Query Model       │  Call LLM API
    └────┬──────────────┘
         │
    ┌────▼──────────────┐
    │ Parse Response    │  Extract structured output
    └────┬──────────────┘
         │
    ┌────▼──────────────┐
    │ Validate Output   │  Check quality/safety
    └────┬──────────────┘
         │
    ┌────▼──────────────┐
    │ Log/Monitor       │  Track performance
    └────┬──────────────┘
         │
    ┌────▼────────┐
    │ Return      │
    │ Result      │
    └─────────────┘
```

## Prompt Versioning

### Version Management

```
prompts/
├── sentiment/
│   ├── v1_baseline.txt
│   ├── v2_with_examples.txt
│   ├── v3_with_role.txt (current)
│   └── v4_experimental.txt
├── classification/
│   ├── v1.txt
│   └── v2.txt
└── README.md (documents each version)

README.md content:
v3 (current, since 2024-01-15):
  - 87% accuracy on test set
  - Previous: v2 (82%)
  - Changes: Added role instruction
  - Status: Production
  
v4 (experimental):
  - 89% accuracy (preliminary)
  - Changes: Added few-shot examples
  - Status: Testing
```

### Deployment Process

```
1. Version update locally
   └─ Test thoroughly
   
2. Create pull request
   └─ Code review by team
   
3. Merge to main branch
   └─ Automated tests run
   
4. Deploy to staging
   └─ Test in production-like environment
   
5. Deploy to production
   └─ Monitor carefully
   
6. Keep previous version available
   └─ Quick rollback if needed
```

## Error Handling and Validation

### Input Validation

```python
class ProductionPromptSystem:
    def query(self, user_input):
        # Validate input
        if not isinstance(user_input, str):
            raise ValueError("Input must be string")
        
        if len(user_input) > 10000:
            raise ValueError("Input too long")
        
        if len(user_input) < 5:
            raise ValueError("Input too short")
        
        # Sanitize dangerous input
        safe_input = self.sanitize(user_input)
        
        # Build prompt
        prompt = self.build_prompt(safe_input)
        
        # Query with fallback
        try:
            response = self.model.query(prompt, timeout=30)
        except TimeoutError:
            return self.fallback_response()
        
        return response
```

### Output Validation

```python
def validate_output(response):
    # Check response structure
    if not isinstance(response, dict):
        raise ValueError("Response must be dict")
    
    # Check required fields
    if "classification" not in response:
        raise ValueError("Missing classification")
    
    # Validate value
    if response["classification"] not in ["positive", "negative", "neutral"]:
        raise ValueError("Invalid classification value")
    
    # Check confidence
    if not 0 <= response.get("confidence", 0) <= 1:
        raise ValueError("Invalid confidence")
    
    return response  # All checks passed
```

## Monitoring and Observability

### Key Metrics

```
PERFORMANCE:
├─ Latency: Time to get response
├─ Throughput: Requests per second
├─ Error rate: % of failed requests
└─ Cost: Per request or per day

QUALITY:
├─ Accuracy: Correct vs. expected
├─ Consistency: Same input → same output
├─ Completeness: All required fields present
└─ Format: Output matches specification

BUSINESS:
├─ User satisfaction: Feedback scores
├─ Fallback rate: When default response used
├─ Retry rate: How often retries needed
└─ Cost per transaction: Total cost / transactions
```

### Monitoring Implementation

```python
from datetime import datetime
import json

class MonitoredPromptSystem:
    def query(self, user_input):
        start_time = time.time()
        
        try:
            response = self._query_impl(user_input)
            success = True
            error = None
        except Exception as e:
            response = self.fallback()
            success = False
            error = str(e)
        
        # Record metrics
        metrics = {
            "timestamp": datetime.now().isoformat(),
            "latency_ms": (time.time() - start_time) * 1000,
            "success": success,
            "error": error,
            "input_length": len(user_input),
            "response_quality": self.score_response(response)
        }
        
        # Log for monitoring
        self.metrics_logger.log(metrics)
        
        return response
```

### Dashboard Example

```
┌─────────────────────────────────────┐
│  Production Prompt System Dashboard  │
├─────────────────────────────────────┤
│                                     │
│  Last 24 hours:                    │
│  ├─ Requests: 125,000             │
│  ├─ Success: 99.2%                │
│  ├─ Avg latency: 1.2s             │
│  ├─ Avg accuracy: 87.3%           │
│  └─ Cost: $427.30                 │
│                                     │
│  Alerts:                           │
│  ├─ ✓ All systems normal          │
│  └─ ⚠️ Latency trending up        │
│                                     │
│  [View Logs] [View Metrics]        │
└─────────────────────────────────────┘
```

## Scaling Prompt Systems

### Caching

```python
class CachedPromptSystem:
    def __init__(self):
        self.cache = {}
    
    def query(self, user_input):
        # Check cache first
        cache_key = hash(user_input)
        if cache_key in self.cache:
            return self.cache[cache_key]
        
        # Query model
        response = self.model.query(user_input)
        
        # Cache result
        self.cache[cache_key] = response
        
        return response
```

### Batch Processing

```python
def batch_process(inputs, batch_size=100):
    results = []
    
    for i in range(0, len(inputs), batch_size):
        batch = inputs[i:i+batch_size]
        
        # Process batch together
        batch_prompts = [build_prompt(inp) for inp in batch]
        batch_results = model.batch_query(batch_prompts)
        
        results.extend(batch_results)
    
    return results
```

### Load Balancing

```
Multiple model instances:

Request → Load Balancer → Instance 1
                       → Instance 2
                       → Instance 3

Benefits:
- Distribute load
- Faster response times
- High availability
```

## Cost Management

### Token Counting

```python
def estimate_cost(prompt, model="gpt-4"):
    # GPT-4: $0.03 per 1K input tokens
    #        $0.06 per 1K output tokens
    
    input_tokens = len(prompt.split()) * 1.3  # estimate
    output_tokens = 150  # typical response length
    
    input_cost = (input_tokens / 1000) * 0.03
    output_cost = (output_tokens / 1000) * 0.06
    
    total_cost = input_cost + output_cost
    return total_cost

# Budget tracking
daily_budget = 500  # $500/day
daily_cost = 0

for request in request_stream:
    request_cost = estimate_cost(request)
    daily_cost += request_cost
    
    if daily_cost > daily_budget:
        # Stop processing or switch to cheaper model
        alert("Daily budget exceeded!")
```

### Model Selection

```
Use cheaper model when possible:
- OpenAI: GPT-4 > GPT-3.5
- Anthropic: Claude 3 Opus > Haiku
- Open source: Llama might be free

Strategy:
1. Start with cheapest model
2. Increase quality if needed
3. Optimize prompts to work with cheap models
4. Use expensive models only where necessary
```

## Reliability Patterns

### Circuit Breaker

Stop requests when system unhealthy:

```python
class CircuitBreaker:
    def __init__(self, failure_threshold=5):
        self.failures = 0
        self.threshold = failure_threshold
        self.open = False
    
    def query(self, prompt):
        if self.open:
            return self.fallback()
        
        try:
            return self.model.query(prompt)
        except Exception:
            self.failures += 1
            if self.failures >= self.threshold:
                self.open = True
                alert("Circuit breaker opened!")
```

### Retry with Backoff

```python
def query_with_retry(prompt, max_retries=3):
    for attempt in range(max_retries):
        try:
            return model.query(prompt)
        except Exception as e:
            if attempt == max_retries - 1:
                raise
            
            wait_time = 2 ** attempt  # 1s, 2s, 4s
            print(f"Retry in {wait_time}s")
            time.sleep(wait_time)
```

## Summary

Production prompt systems require:

1. **Reliability**: Validate, handle errors, fallbacks
2. **Monitoring**: Track performance and quality
3. **Versioning**: Control changes and enable rollbacks
4. **Scalability**: Cache, batch, load balance
5. **Cost management**: Monitor spend, optimize
6. **Observability**: Understand what's happening

These practices transform prompting from experimentation to robust, production-grade systems.

---

**Previous:** [Multi-Modal Prompting](./07-multimodal-prompting.md) | **Next Chapter:** [Robotic Intelligence Fundamentals →](../robotic-ai/01-robot-basics.md)
