# A/B Testing - Quick Reference Card

## 🎯 A/B Testing in 30 Seconds

Test two versions (A and B) to see which works better.

---

## 🚀 Start in 3 Commands

```bash
# 1. Create experiment
node rag/create-experiment.js

# 2. Send test requests (replace YOUR_ID)
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"test","variant":"A","experimentId":"YOUR_ID"}'

# 3. View results
node rag/view-analytics.js
```

---

## 📊 What Gets Tracked

| What | Where | Use |
|------|-------|-----|
| Question | `userMessage` | Know what user asked |
| Answer | `botResponse` | Track what bot replied |
| Speed | `responseTime` | Measure performance |
| Rating | `userRating` | Measure satisfaction |
| Sources | `sources` | Track relevance |

---

## 🏆 Winning Criteria

**Sample Size** (need both):
- Variant A: 30+
- Variant B: 30+

**Metrics** (any):
- Avg rating (1-5 stars)
- Avg response time (ms)
- Custom metric

**Confidence**:
- High = 30+ samples
- Medium = 10-29 samples
- Low = < 10 samples

---

## 📁 Files Created

```
rag/
├── analytics.js           # Core system
├── view-analytics.js      # Dashboard
├── create-experiment.js   # Setup
├── example-ab-test.js     # Example
└── analytics.json         # Results (auto-created)

Docs/
├── AB_TESTING_GUIDE.md        # Full guide
├── AB_TESTING_FIRST_STEPS.md  # Quick start
└── AB_TESTING_SUMMARY.md      # This overview
```

---

## 💡 Test Ideas

| Idea | Variant A | Variant B | Metric |
|------|-----------|-----------|--------|
| Sources | 4 sources | 3 sources | Rating |
| Speed | Original | Optimized | Time |
| Tone | Formal | Casual | Rating |
| Color | Purple | Blue | Clicks |
| Length | Long | Short | Rating |

---

## ⚙️ API Format

### Send Request with Variant

```json
{
  "message": "Your question",
  "variant": "A",
  "experimentId": "exp_123_abc",
  "userRating": 4
}
```

### Track Interaction (backend)

```javascript
trackInteraction({
  variant: "A",
  experimentId: id,
  userMessage: msg,
  botResponse: reply,
  sources: [...],
  responseTime: ms,
  userRating: 1-5
});
```

---

## 📈 Reading Results

```
Variant A: 45 interactions, avg 4.1/5 ⭐
Variant B: 48 interactions, avg 4.3/5 ⭐

Winner: Variant B
Difference: +0.2 points
Confidence: High

Action: Deploy B
```

---

## ✅ Checklist

- [ ] `node rag/create-experiment.js` → Get ID
- [ ] Send 30+ requests per variant
- [ ] Each request has `variant` + `experimentId`
- [ ] `node rag/view-analytics.js` → See winner
- [ ] Deploy winning version

---

## 🆘 Quick Fixes

| Problem | Solution |
|---------|----------|
| Module not found | `cd my-book` first |
| Server error | `npm run rag:serve` |
| Not enough data | Send more requests |
| Want to see demo | `node rag/example-ab-test.js` |

---

## 📞 Resources

- **Quick Start:** `AB_TESTING_FIRST_STEPS.md`
- **Full Guide:** `AB_TESTING_GUIDE.md`
- **Overview:** `AB_TESTING_SUMMARY.md`
- **Working Example:** Run `example-ab-test.js`

---

**A/B Testing Framework for RAG Chatbot**  
Version 1.0 | Ready to Use | December 2025
