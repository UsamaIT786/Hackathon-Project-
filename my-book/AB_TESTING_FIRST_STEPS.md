# 🚀 A/B Testing - Quick Start (First 5 Steps)

Urdu: **A/B Testing کے پہلے اقدامات**

---

## 🎯 کیا ہے A/B Testing؟

دو ورژن (A اور B) کا موازنہ کر کے یہ دیکھنا کہ کون سا بہتر ہے۔

**مثالیں:**
- 3 sources vs 4 sources دکھانا
- سرخ بٹن vs نیلے بٹن
- مختصر جواب vs تفصیلی جواب

---

## 📊 STEP 1: Analytics System Initialize کریں

ہمنے پہلے سے 3 فائلیں بنائی ہیں:

```
rag/analytics.js          ← ڈیٹا track کرتا ہے
rag/view-analytics.js     ← نتائج دکھاتا ہے
rag/create-experiment.js  ← نیا test بناتا ہے
```

**کوئی setup کی ضرورت نہیں** - یہ خود initialize ہوں گی۔

---

## 📋 STEP 2: پہلا Experiment بنائیں

```bash
cd c:\Users\PC\Desktop\spec-kit-plus\my-book
node rag/create-experiment.js
```

**Output ہوگی:**
```
✅ First experiment created successfully!

📌 Experiment ID: exp_1234567890_abcdef

📋 Next Steps:
1️⃣  Send test requests with variant parameter
2️⃣  Collect at least 30 interactions per variant
3️⃣  Run for 3-7 days to gather sufficient data
4️⃣  View results: node rag/view-analytics.js
```

**اپنا Experiment ID save کریں!** (آگے استعمال میں)

---

## 🧪 STEP 3: دونوں Variants کو Test کریں

اپنا experiment ID copy کریں اور یہ commands چلائیں:

### Variant A (Control - موجودہ):

```powershell
$body = @{
    message = "What is sensor fusion?"
    variant = "A"
    experimentId = "exp_YOUR_ID_HERE"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3001/api/chat" `
    -Method POST `
    -Headers @{"Content-Type"="application/json"} `
    -Body $body
```

### Variant B (Test - نیا):

```powershell
$body = @{
    message = "What is sensor fusion?"
    variant = "B"
    experimentId = "exp_YOUR_ID_HERE"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3001/api/chat" `
    -Method POST `
    -Headers @{"Content-Type"="application/json"} `
    -Body $body
```

**ہر variant کو 15-20 بار چلائیں** (مختلف سوالات کے ساتھ)

---

## 📊 STEP 4: نتائج دیکھیں

```bash
node rag/view-analytics.js
```

**Sample Output:**
```
============================================================
📊 A/B Test Results: Retrieval Context Size
============================================================

📈 Variant A (Control):
   Sample size: 20
   Avg response time: 487ms

🆕 Variant B (Test):
   Sample size: 18
   Avg response time: 423ms

🏆 Winner: Variant B
   Difference: 64ms faster
   Confidence: Medium (need 30+ samples for High)
```

---

## ⭐ STEP 5: User Ratings شامل کریں (Optional)

اگر آپ satisfaction measure کرنا چاہتے ہیں:

```javascript
// server.js میں trackInteraction میں یہ شامل کریں:

trackInteraction({
  variant: variant,
  experimentId: experimentId,
  userMessage: message,
  botResponse: reply,
  sources: sources,
  responseTime: responseTime,
  userRating: 4  // 1-5 stars میں user کی rating
});
```

جب 30+ ratings ہو جائیں تو average rating دیکھا جائے گا۔

---

## 🎯 سادہ مثال (Copy-Paste Ready)

آپ کی پہلی test چلانے کے لیے:

**File:** `first-ab-test.js`

```javascript
import { createExperiment, trackInteraction, getExperimentResults, printResults } from './rag/analytics.js';

// Step 1: Experiment بنائیں
const expId = createExperiment({
  name: 'My First Test',
  hypothesis: 'Version B will be faster',
  variantA: { description: 'Current version' },
  variantB: { description: 'Optimized version' },
  successMetric: 'Response time < 500ms',
  expectedDuration: '3 days'
});

console.log(`\nExperiment ID: ${expId}\n`);

// Step 2: کچھ dummy interactions شامل کریں
for (let i = 0; i < 5; i++) {
  trackInteraction({
    variant: 'A',
    experimentId: expId,
    userMessage: 'Test question ' + (i + 1),
    botResponse: 'Test answer',
    sources: [],
    responseTime: 450 + Math.random() * 100
  });
  
  trackInteraction({
    variant: 'B',
    experimentId: expId,
    userMessage: 'Test question ' + (i + 1),
    botResponse: 'Test answer',
    sources: [],
    responseTime: 350 + Math.random() * 100
  });
}

// Step 3: نتائج دیکھیں
const results = getExperimentResults(expId);
printResults(results);
```

**چلائیں:**
```bash
node first-ab-test.js
```

---

## ✅ Checklist: پہلا Test مکمل کرنے کے لیے

- [ ] `node rag/create-experiment.js` چلایا
- [ ] Experiment ID save کیا
- [ ] Variant A کو 10+ بار test کیا
- [ ] Variant B کو 10+ بار test کیا
- [ ] `node rag/view-analytics.js` سے نتائج دیکھے
- [ ] کس variant نے بہتر performance دیا؟

---

## 💡 کیا ہوگا اگلے مراحل میں؟

1. ✅ **پہلے 3 دن:** 30+ interactions collect کریں
2. ✅ **دن 4-7:** نتائج دیکھیں اور winner decide کریں
3. ✅ **دن 8:** Winning variant کو deploy کریں
4. ✅ **دن 9:** اگلا test شروع کریں

---

## 🆘 اگر مسئلہ ہو تو:

### Server نہیں چل رہا؟
```bash
npm run rag:serve
```

### Docusaurus نہیں چل رہا؟
```bash
npm start
```

### Files موجود نہیں ہیں؟
```bash
ls rag/analytics.js
ls rag/view-analytics.js
ls rag/create-experiment.js
```

---

## 📚 مکمل Guide کے لیے:

`AB_TESTING_GUIDE.md` پڑھیں (مکمل دستاویزات ہے)

---

**بہت آسان ہے! بس 5 منٹ میں شروع کر سکتے ہو۔** 🚀

Urdu: **بہت سادہ ہے! بس 5 منٹ میں شروع کریں اور اپنا پہلا A/B test چلائیں!**
