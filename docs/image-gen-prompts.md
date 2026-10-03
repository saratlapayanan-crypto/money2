# ชุด Prompt สำหรับ Generate ภาพไพ่ Tarot (สไตล์ Storybook ไทย)

> ใช้กับเครื่องมือ generate ภาพของคุณ (เช่น ที่สร้างภาพตัวอย่างมา)
> เป้าหมาย: ภาพไพ่สไตล์เดียวกับตัวอย่าง — storybook ไทยแฟนตาซี กรมท่า-ทอง
> **ไม่มีตัวหนังสือบนไพ่ทั้งหมด** (ตัวหนังสือระบบเราวาดทับภายหลัง)

---

## Master Style (ใส่นำหน้าทุก prompt)

```
Vertical tarot card illustration, 2:3 ratio, no text, no letters, no watermark.
Storybook fantasy digital painting, soft painterly watercolor-gouache style.
Deep midnight indigo background with subtle scattered star speckles.
Ornate metallic gold frame: thin double border with a pointed arch and
lotus-bud finial on top, small gold corner flourishes.
Serene mood, soft glowing highlights, gentle light bloom, muted navy-and-gold
palette with one warm accent color. Flat-ish shading, no harsh outlines.
```

**Negative prompt (ถ้าเครื่องมือรองรับ):**
```
text, letters, numbers, typography, watermark, signature, photorealistic, 3d render,
neon, cyberpunk, gore, scary, cluttered, busy background, low contrast
```

---

## Major Arcana 22 ใบ (ชื่อไฟล์ตามที่ระบบใช้)

วาด "หญิงสาวไทยนั่งสงบถือวัตถุสัญลักษณ์" เป็นหลัก (เหมือนภาพตัวอย่าง) โดยเปลี่ยนวัตถุ/ฉากหลังตามความหมายไพ่:

| ไฟล์ | ไพ่ | เพิ่มต่อท้าย Master Style |
|---|---|---|
| `major-0` | The Fool | young traveler with a small bundle on a stick, playful puppy beside, standing at a cliff edge, white rose, dawn light |
| `major-1` | The Magician | figure with raised wand, glowing infinity symbol above, small table with cup, coin, sword, wand |
| `major-2` | High Priestess | seated woman between two pillars, crescent moon at her feet, scroll, starry veil |
| `major-3` | The Empress | woman with star crown in golden wheat field, heart-shaped shield, roses |
| `major-4` | The Emperor | dignified elder on throne with ram-head armrests, golden scepter |
| `major-5` | The Hierophant | gentle teacher with triple-bar golden staff, two crossed keys, two students |
| `major-6` | The Lovers | couple holding hands under a benevolent winged figure, soft sunlight |
| `major-7` | The Chariot | rider in a golden chariot with star canopy, two serene mythical creatures |
| `major-8` | Strength | maiden gently touching a friendly lion, infinity symbol, flower garland |
| `major-9` | The Hermit | hooded elder holding a glowing lantern with a star inside, mountain path |
| `major-10` | Wheel of Fortune | ornate golden wheel with eight spokes, small sphinx on top, clouds |
| `major-11` | Justice | calm woman holding balanced scales and an upright sword, two pillars |
| `major-12` | Hanged Man | serene man suspended upside-down from a blossoming tree, golden halo (peaceful, not grim) |
| `major-13` | Death | white horse with rider in dark cloak, white roses, sunrise between two towers (gentle transformation mood, not horror) |
| `major-14` | Temperance | angel pouring water between two golden cups, pool with ripples |
| `major-15` | The Devil | horned shadow figure made of smoke, loose chains falling away (overcoming-bondage mood) |
| `major-16` | The Tower | tower struck by golden lightning, falling golden crown, sparks (dramatic but not gory) |
| `major-17` | The Star | maiden pouring water from two jugs, one large glowing star and seven small stars |
| `major-18` | The Moon | moon with gentle face, two towers, dog and wolf howling softly, small crayfish, night path |
| `major-19` | The Sun | radiant smiling sun, child riding a white horse with red ribbon, sunflowers |
| `major-20` | Judgement | angel with a long golden trumpet, people rising joyfully with raised arms |
| `major-21` | The World | dancing figure inside a laurel wreath with red ribbons, four glowing creatures at corners |

---

## Minor Arcana 56 ใบ — ประหยัดงบ gen ด้วย "template 4 ชุด"

แนะนำ gen แค่ **4 ภาพ template** (ภาพวัตถุชุดใหญ่กลางการ์ด) แล้วระบบเราเรียงจำนวน 1–10 + ประกอบการ์ดตัวต่อเอง:

| ไฟล์ | Prompt เพิ่ม |
|---|---|
| `tpl-wands` | a single ornate golden staff with a glowing flame-shaped top, centered |
| `tpl-cups` | a single ornate golden chalice with lotus engraving, soft blue water glow |
| `tpl-swords` | a single elegant silver sword with golden crossguard, point down |
| `tpl-pentacles` | a single ornate gold coin with an engraved star, gentle green glow |

(ถ้าอยากได้ทุกใบเฉพาะตัว ให้ gen เพิ่ม: "N glowing golden staffs arranged in symmetric pattern" — เปลี่ยน N และคำวัตถุ)

การ์ดตัวต่อ (Page/Knight/Queen/King × 4 ชุด = 16 ใบ): ใช้หญิงสาว/ชายหนุ่มนั่งถือวัตถุของชุด + มงกุฎ/หมวกต่างกัน

---

## หลังไพ่ 7 แบบ (ไฟล์ `back-<ธีม>`)

ใช้ Master Style + `ornate symmetrical card back design, central emblem,` แล้วเติม:

| ไฟล์ | เพิ่มต่อท้าย |
|---|---|
| `back-standard` | eight-pointed gold star mandala inside concentric lotus rings |
| `back-songkran` | water droplets and flowing waves, golden bowl with lotus, aqua-teal accent |
| `back-loy-krathong` | floating krathong (lotus basket with candle) on night water, sky lanterns, crescent moon |
| `back-halloween` | friendly carved pumpkin, bats, orange moon (cute, not scary) |
| `back-christmas` | snowflakes, holly, red ribbon gift, pine green and warm gold |
| `back-valentine` | layered hearts, rose buds, cupid arrow, soft pink accent |
| `back-minimalist` | simple thin gold lines, one triangle in a circle, minimal |

---

## วิธีส่งภาพกลับมาให้ผม

1. วางไฟล์ PNG/WebP ตามชื่อที่กำหนดไว้ในโฟลเดอร์ `assets/cards/` (ผมสร้างโครงให้)
2. บอกผมว่า "ต่อภาพเข้าระบบ" — ผมจะแก้ `js/art/tarot-art.js` ให้:
   - ถ้ามีไฟล์ภาพ → ใช้ `<img>` โหลดภาพ + วางตัวหนังสือไทย/เลขโรมันทับ (ระบบ SVG ปัจจุบัน)
   - ถ้าไม่มี → ใช้ SVG ที่วาดโค้ดไว้เป็น fallback อัตโนมัติ
3. ขนาดที่แนะนำ: **760×1140 px ขึ้นไป** (สัดส่วน 2:3) จะคมทั้งมือถือและตอนแชร์

## ข้อควรระวังลิขสิทธิ์

- อย่าใส่ชื่อศิลปิน/สำรับจริงใน prompt (เช่น "in the style of [deck name]") เพราะอาจดึงลายของสำรับที่มีลิขสิทธิ์เข้ามา
- โครงสร้างคำอธิบายข้างบนเป็นการ "บรรยายสไตล์" (ธีม/สี/องค์ประกอบ) ซึ่งปลอดภัยกว่าการอ้างอิงผลงานเฉพาะ
- เก็บ prompt + ประวัติการสร้างไว้ที่ไฟล์นี้เป็นหลักฐาน provenance ของทีม
