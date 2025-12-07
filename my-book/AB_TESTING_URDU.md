# A/B Testing - اردو میں مکمل گائیڈ

**تاریخ:** 7 دسمبر 2025  
**حالت:** ✅ مکمل اور استعمال کے لیے تیار

---

## 🎯 A/B Testing کیا ہے؟

دو ورژن (A اور B) کا موازنہ کر کے دیکھنا کہ کون سا بہتر ہے۔

### مثالیں:

```
Test 1: 4 sources vs 3 sources دکھانا
Test 2: تیز vs سست جواب
Test 3: سرخ بٹن vs نیلے بٹن
Test 4: طویل جواب vs مختصر جواب
```

---

## 🚀 پہلا Test چلانے کے لیے (5 منٹ)

### Step 1: Experiment بنائیں

```bash
node rag/create-experiment.js
```

**آپ کو ملے گا:**
- ✅ Experiment ID (save کریں!)
- ✅ اگلے مراحل
- ✅ curl commands

### Step 2: دونوں ورژن test کریں

**Variant A (موجودہ):**
```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"سوال","variant":"A","experimentId":"YOUR_ID"}'
```

**Variant B (نیا):**
```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"سوال","variant":"B","experimentId":"YOUR_ID"}'
```

### Step 3: نتائج دیکھیں

```bash
node rag/view-analytics.js
```

---

## 📊 کیا ریکارڈ ہوتا ہے؟

ہر سوال-جواب میں یہ محفوظ ہوتا ہے:

```javascript
{
  variant: "A یا B",           // کون سا ورژن؟
  userMessage: "سوال",        // صارف نے کیا پوچھا؟
  botResponse: "جواب",        // بات نے کیا جواب دیا؟
  responseTime: 487,           // کتنی تیزی؟ (milliseconds)
  userRating: 4,              // کتنا اچھا؟ (1-5 ستارے)
  sources: [...]              // کون سے ذرائع استعمال ہوئے؟
}
```

---

## 📈 نتائج کو سمجھیں

### Output کی مثال:

```
============================================================
📊 A/B Test Results: Retrieval Context Size
============================================================

📈 Variant A (موجودہ):
   Interactions: 25
   اوسط رفتار: 487ms
   صارف کی درجہ بندی: 4.1/5

🆕 Variant B (نیا):
   Interactions: 28
   اوسط رفتار: 388ms
   صارف کی درجہ بندی: 4.3/5

🏆 جیتنے والا: Variant B
   فرق: 99ms (تیز)
   اعتماد: زیادہ

============================================================
```

### کیا مطلب ہے؟

- **Sample Size:** کتنے لوگوں نے test کیا؟
- **Avg Rating:** صارفین نے کتنا اچھا دیا؟ (1-5)
- **Response Time:** جواب کتنا تیز آیا؟
- **Winner:** کون سا ورژن بہتر ہے؟
- **Confidence:** نتیجہ کتنا قابلِ اعتماد ہے؟

---

## ✅ جیتنے والے کا فیصلہ

### ضروری شرائط:

- [ ] Variant A میں 30+ interactions
- [ ] Variant B میں 30+ interactions
- [ ] کم از کم 3-7 دن test چلے
- [ ] کوئی واضح فرق ہو

### Confidence Levels:

| نمونہ سائز | اعتماد |
|-----------|--------|
| < 10 | کم |
| 10-29 | درمیانی |
| 30+ | زیادہ |

---

## 🎯 Test کرنے کے لیے آئیڈیز

### Test 1: Sources کی تعداد

```
فرضیہ: 3 sources بہتر ہے 4 سے
Variant A: 4 sources (موجودہ)
Variant B: 3 sources (نیا)
```

### Test 2: جواب کا انداز

```
فرضیہ: دوستانہ لہجہ بہتر ہے
Variant A: رسمی انداز
Variant B: دوستانہ انداز
```

### Test 3: بٹن کا رنگ

```
فرضیہ: جامنی رنگ بہتر ہے
Variant A: جامنی (#667eea)
Variant B: نیلا (#4289F4)
```

### Test 4: جواب کی لمبائی

```
فرضیہ: مختصر جواب بہتر ہے
Variant A: تفصیلی (300+ الفاظ)
Variant B: مختصر (150 الفاظ)
```

---

## 🏃 عملی مثال

### فائل بنائیں: `my-first-ab-test.js`

```javascript
import { createExperiment, trackInteraction, getExperimentResults, printResults } from './rag/analytics.js';

// 1. Experiment بنائیں
const expId = createExperiment({
  name: 'میرا پہلا Test',
  hypothesis: 'ورژن B تیز ہے',
  variantA: { description: 'موجودہ' },
  variantB: { description: 'نیا' },
  successMetric: 'رفتار < 500ms',
  expectedDuration: '3 دن'
});

console.log(`ID: ${expId}\n`);

// 2. Interactions شامل کریں
for (let i = 0; i < 10; i++) {
  // Variant A
  trackInteraction({
    variant: 'A',
    experimentId: expId,
    userMessage: 'سوال ' + (i + 1),
    botResponse: 'جواب',
    responseTime: 450 + Math.random() * 100,
    userRating: 4 + Math.random()
  });
  
  // Variant B
  trackInteraction({
    variant: 'B',
    experimentId: expId,
    userMessage: 'سوال ' + (i + 1),
    botResponse: 'جواب',
    responseTime: 350 + Math.random() * 100,
    userRating: 4.5 + Math.random()
  });
}

// 3. نتائج دیکھیں
const results = getExperimentResults(expId);
printResults(results);
```

### چلائیں:

```bash
node my-first-ab-test.js
```

---

## 📁 فائلوں کی فہرست

```
rag/
├── analytics.js              # مرکزی نظام
├── view-analytics.js         # ڈیش بورڈ
├── create-experiment.js      # سیٹ اپ
├── example-ab-test.js        # مثال
└── analytics.json            # ڈیٹا (خود بنتی ہے)

Docs/
├── AB_TESTING_GUIDE.md       # مکمل گائیڈ
├── AB_TESTING_FIRST_STEPS.md # تیز شروعات
├── AB_TESTING_SUMMARY.md     # خلاصہ
├── AB_TESTING_CHEATSHEET.md  # فوری حوالہ
└── AB_TESTING_URDU.md        # یہ فائل
```

---

## 🔧 انضمام آپ کے Server کے ساتھ

### `rag/server.js` میں شامل کریں:

```javascript
import { trackInteraction } from './analytics.js';

app.post('/api/chat', async (req, res) => {
  const startTime = Date.now();
  const { message, variant = 'A', experimentId } = req.body;
  
  // ... آپ کا موجودہ کوڈ ...
  
  // Interaction ریکارڈ کریں
  trackInteraction({
    variant: variant,
    experimentId: experimentId,
    userMessage: message,
    botResponse: reply,
    responseTime: Date.now() - startTime
  });
  
  res.json({ reply, sources });
});
```

---

## 🆘 عام مسائل اور حل

### مسئلہ: "Module not found"

**حل:**
```bash
cd c:\Users\PC\Desktop\spec-kit-plus\my-book
node rag/create-experiment.js
```

### مسئلہ: Server سے رابطہ نہیں ہو رہا

**حل:**
```bash
npm run rag:serve
```

### مسئلہ: ابھی "Not enough data"

**حل:** مزید requests بھیجیں (30+ چاہیے)

### دیکھنا چاہتے ہو کہ کیسے کام کرتا ہے؟

**حل:**
```bash
node rag/example-ab-test.js
```

---

## 📚 دستاویزات

| نام | مقصد | کب پڑھیں |
|------|------|----------|
| `AB_TESTING_FIRST_STEPS.md` | تیز شروعات | ابھی |
| `AB_TESTING_GUIDE.md` | مکمل تفصیلات | تفصیل کے لیے |
| `AB_TESTING_SUMMARY.md` | خلاصہ | ساری معلومات |
| `AB_TESTING_CHEATSHEET.md` | فوری حوالہ | رفع حال |

---

## 🎓 A/B Testing کی بنیادیں

### کیوں کریں؟

```
مسئلہ: نہیں معلوم کہ کون سا ورژن بہتر ہے
حل: دونوں test کریں اور نتائج دیکھیں
فائدہ: بہتری اور اعتماد
```

### کب کریں؟

```
- بڑی تبدیلیوں سے پہلے
- صارف کی رائے میں فرق کے لیے
- رفتار بہتر کرنے کے لیے
- نیا فیچر لانچ کرنے سے پہلے
```

### کیسے کریں؟

```
1. فرضیہ لکھیں
2. دونوں ورژن تیار کریں
3. کچھ دن test کریں
4. نتائج دیکھیں
5. جیتنے والا deploy کریں
```

---

## ✨ اہم خصوصیات

✅ **مقامی ڈیٹا** - تمام معلومات آپ کے پاس  
✅ **سادہ API** - صرف `variant` اور `experimentId` بھیجیں  
✅ **خودکار تجزیہ** - اوسط، فرق، جیتنے والا خود نکلتا ہے  
✅ **JSON میں محفوظ** - آسانی سے برآمد، تجزیہ، بیک اپ  
✅ **تیار** - فوری استعمال کے لیے  

---

## 🚀 شروع کریں!

```bash
# Step 1
node rag/create-experiment.js

# Step 2 (اپنا ID لگائیں)
curl -X POST http://localhost:3001/api/chat ...

# Step 3
node rag/view-analytics.js
```

**صرف 5 منٹ میں شروع ہو جائیں!**

---

## 📞 مدد کے لیے

1. `AB_TESTING_FIRST_STEPS.md` پڑھیں
2. `node rag/example-ab-test.js` چلائیں
3. `node rag/view-analytics.js` سے نتائج دیکھیں

---

**نسخہ:** 1.0  
**حالت:** مکمل اور تیار  
**تاریخ:** 7 دسمبر 2025  

**خوش رہیں! A/B Testing شروع کریں اور اپنی چیٹ بات بہتر بنائیں!** 🚀✨
