# Prompt สำหรับส่งให้ AI แก้ไข 3 จุด

> **วิธีใช้**: Copy ส่งทั้งหมดใน conversation เดิมที่ทำ Phase 12 เสร็จแล้ว
> ถ้าเป็น conversation ใหม่ ต้องส่ง Master Prompt + Reference Manual ก่อน แล้วค่อยส่ง prompt นี้

---

## ส่งข้อความนี้:

```text
จาก QA audit พบปัญหา 3 จุดที่ต้องแก้ไข ทำตามลำดับนี้:

---

## Fix 1: test.html import ผิดชื่อ (5 นาที)

ไฟล์: test.html

ปัญหา: บรรทัดที่ import จาก crypto.js ใช้ชื่อ hashStringToInt แต่ตอนนี้ crypto.js export ชื่อ getDeterministicNumber

แก้ไข:
1. เปิด test.html
2. หา import ที่อ้างถึง hashStringToInt
3. เปลี่ยนเป็น getDeterministicNumber
4. ตรวจว่า test ทุกข้อใน test.html รันผ่านไม่มี error ใน console

แสดง code ที่แก้

---

## Fix 2: เพิ่ม post-shuffle validation (5 นาที)

ไฟล์: js/engines/personal-engine.js

ปัญหา: ตรวจ new Set(allIds).size === 78 ก่อน shuffle แต่ไม่ได้ตรวจหลัง shuffle

แก้ไข:
1. หาบรรทัดหลังจาก secureShuffle() ถูกเรียก
2. เพิ่มการตรวจสอบ:

if (new Set(shuffled).size !== 78) {
    throw new Error('Critical: Deck integrity compromised after shuffle');
}

3. ตรวจว่า Personal Reading ยังทำงานปกติ

แสดง code ที่แก้

---

## Fix 3: เพิ่ม interpretations ที่ขาด 53 ใบ (ใหญ่)

ไฟล์: data/interpretations.json

ปัญหา: ตอนนี้มี interpretation แค่ 25 ใบ (Major 22 + wands-1, cups-1, swords-1)
ขาดอีก 53 ใบ:
- Wands 2–14 (13 ใบ)
- Cups 2–14 (13 ใบ)
- Swords 2–14 (13 ใบ)
- Pentacles 1–14 (14 ใบ)

กฎ:
- ทำเป็น batch ตาม TOKEN RULE (Section 29)
- แต่ละ card ต้องมี interpretation สำหรับ love, finance, work (3 entries)
- แต่ละ entry ต้องมี: score (1-5), status (positive/neutral/caution), summary, action, warning (หรือ null)
- ต้องเป็น Contextual Interpretation ไม่ใช่แค่ good/bad
- ภาษาไทย
- ห้ามสร้างทั้งหมดใน response เดียวถ้าคุณภาพจะลดลง

แบ่งเป็น batch:

Batch A: Wands 2–14 (13 ใบ × 3 categories = 39 entries)
Batch B: Cups 2–14 (13 ใบ × 3 categories = 39 entries)
Batch C: Swords 2–14 (13 ใบ × 3 categories = 39 entries)
Batch D: Pentacles 1–14 (14 ใบ × 3 categories = 42 entries)

ทำทีละ batch
ตรวจทุก batch ว่า:
- card_id ตรงกับ cards.json
- ไม่ซ้ำกับ interpretation ที่มีอยู่แล้ว
- format ถูกต้อง
- คุณภาพการตีความดี

เริ่ม Fix 1 และ Fix 2 ก่อน แล้วทำ Fix 3 Batch A

เมื่อเสร็จแต่ละ batch ให้หยุดรอคำสั่ง batch ถัดไป
```

---

## หลังจาก AI ทำ Fix 1 + Fix 2 + Batch A เสร็จ ส่งทีละข้อความ:

```text
ทำ Fix 3 Batch B: Cups 2–14
```

```text
ทำ Fix 3 Batch C: Swords 2–14
```

```text
ทำ Fix 3 Batch D: Pentacles 1–14
```

---

## หลังครบทุก batch ส่ง:

```text
ตรวจ interpretations.json ทั้งหมด:
1. นับจำนวน entries ทั้งหมด
2. ตรวจว่า card_id ทุกตัวมีใน cards.json
3. ตรวจว่าทุก card มีครบ 3 categories (love, finance, work)
4. ตรวจว่า Major Arcana มี daily message ด้วย
5. รัน test.html แล้วแจ้งผลทุกข้อ
6. แสดง FINAL PROJECT STATE
```
