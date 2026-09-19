# Prompt แก้ Encoding — ส่งทีละ step

---

## Step 1: ส่งก่อน (อธิบายปัญหา + ทำ Batch A)

```text
ปัญหาเร่งด่วน: interpretations.json ที่เพิ่มใหม่ 159 entries ภาษาไทยเสียทั้งหมด เป็น ????? ทั้งหมด

สาเหตุ: ตอน save ไฟล์ encoding ผิด ทำให้ภาษาไทยหายไป

ข้อมูลเดิมที่ยังดีอยู่ (97 entries แรก): Major Arcana 22 ใบ + wands-1, cups-1, swords-1 ภาษาไทยปกติ
ข้อมูลที่เสีย (159 entries): Wands 2–14, Cups 2–14, Swords 2–14, Pentacles 1–14 เป็น ????? ทั้งหมด

วิธีแก้:

1. เปิด data/interpretations.json
2. ลบ 159 entries ที่เสีย (ตั้งแต่ wands-2 เป็นต้นไป) ออกทั้งหมด เหลือแค่ 97 entries เดิมที่ดี
3. สร้าง interpretation ภาษาไทยใหม่ทั้ง 53 ใบที่ขาด

กฎสำคัญ:

- ทุกครั้งที่เขียนไฟล์ ต้องใช้ encoding UTF-8 เท่านั้น
- ถ้าใช้คำสั่ง PowerShell ให้ใช้:
  [System.IO.File]::WriteAllText($path, $content, [System.Text.Encoding]::UTF8)
  หรือ Set-Content -Encoding utf8
- ห้ามใช้ Out-File โดยไม่ระบุ -Encoding utf8
- หลัง save แล้วต้องตรวจว่าภาษาไทยไม่เป็น ?????

- แต่ละ card ต้องมี 3 entries: love, finance, work
- แต่ละ entry ต้องมี: card_id, category, subtopic ("overall"), score (1-5), status (positive/neutral/caution), summary, action, warning (หรือ null)
- summary และ action ต้องเป็นภาษาไทย ยาวอย่างน้อย 20 ตัวอักษร
- ต้องเป็น Contextual Interpretation ตาม MASTER PROMPT Section 8
- ห้ามสร้างทั้งหมดใน response เดียวถ้าคุณภาพจะลดลง

เริ่ม Batch A: Wands 2–14 (13 ใบ × 3 categories = 39 entries)

ตัวอย่าง format (ดูจาก wands-1 ที่ยังดีอยู่):

{
  "card_id": "wands-2",
  "category": "love",
  "subtopic": "overall",
  "score": 3,
  "status": "neutral",
  "summary": "กำลังตัดสินใจระหว่างสองทาง ความรักต้องการทิศทางที่ชัดเจน",
  "action": "ใช้เวลาทบทวนว่าอะไรสำคัญกับคุณจริงๆ ก่อนตัดสินใจ",
  "warning": "อย่าปล่อยให้ความลังเลกินเวลานานเกินไป"
}

เมื่อสร้าง Batch A เสร็จ:
1. ลบ entries เก่าที่เสียออก
2. เพิ่ม entries ใหม่เข้าไป
3. save ด้วย UTF-8
4. ตรวจว่าภาษาไทยแสดงถูกต้อง ไม่เป็น ?????
5. แสดงตัวอย่าง 2-3 entries ที่ save แล้วเพื่อยืนยัน

จากนั้นหยุดรอคำสั่ง Batch B
```

---

## Step 2: หลัง Batch A เสร็จ

```text
ตรวจว่า Batch A (Wands 2–14) ภาษาไทยแสดงถูกต้องแล้ว

ทำ Batch B: Cups 2–14 (13 ใบ × 3 categories = 39 entries)

กฎเดิม:
- encoding UTF-8 เท่านั้น
- summary/action ภาษาไทย ≥ 20 ตัวอักษร
- Contextual Interpretation ไม่ใช่แค่ good/bad
- หลัง save ตรวจว่าไม่เป็น ?????

เมื่อเสร็จ หยุดรอคำสั่ง Batch C
```

---

## Step 3:

```text
ทำ Batch C: Swords 2–14 (13 ใบ × 3 categories = 39 entries)

กฎเดิม: encoding UTF-8, ภาษาไทย ≥ 20 ตัวอักษร, Contextual Interpretation

เมื่อเสร็จ หยุดรอคำสั่ง Batch D
```

---

## Step 4:

```text
ทำ Batch D: Pentacles 1–14 (14 ใบ × 3 categories = 42 entries)

หมายเหตุ: pentacles-1 เดิมมี interpretation อยู่แล้ว แต่อาจเป็น ????? 
ให้ลบของเก่าแล้วสร้างใหม่ทั้ง 14 ใบ

กฎเดิม: encoding UTF-8, ภาษาไทย ≥ 20 ตัวอักษร, Contextual Interpretation

เมื่อเสร็จ หยุดรอคำสั่งตรวจสอบ
```

---

## Step 5: ตรวจสอบสุดท้าย

```text
ตรวจ interpretations.json ทั้งหมด:

1. เปิดไฟล์แล้วตรวจว่า encoding เป็น UTF-8
2. นับ entries ทั้งหมด (ควรได้ ~256)
3. ตรวจว่า card_id ทุกตัวมีใน cards.json
4. ตรวจว่าทุก card 78 ใบ มีครบ 3 categories (love, finance, work)
5. ตรวจว่า Major Arcana 22 ใบ มี daily message
6. ตรวจว่าไม่มี entry ไหนที่ summary หรือ action เป็น ?????
7. แสดงตัวอย่าง 1 entry จากแต่ละ suit (Wands, Cups, Swords, Pentacles) เพื่อยืนยันภาษาไทย
8. แสดง FINAL PROJECT STATE
```
