# Asset Licenses

This document outlines the licenses for third-party assets and libraries used in the Thai Tarot Web Application.

## CSS Framework
- **Tailwind CSS (via CDN)**
  - License: MIT License
  - Source: [https://tailwindcss.com/](https://tailwindcss.com/)
  - Note: Used for styling the application structure and components.

## Fonts (Google Fonts — OFL)
- **Charm** — หัวเรื่อง/ตัวเลขบนไพ่ (SIL Open Font License)
- **Noto Sans Thai** — เนื้อความ (SIL Open Font License)
- โหลดผ่าน Google Fonts CDN ทุกหน้า HTML

## Card Artwork (2026-09-19 เป็นต้นไป)
- ภาพหน้าไพ่ 78 ใบ และหลังไพ่ทั้ง 7 ธีม **วาดขึ้นใหม่เป็น SVG vector ต้นฉบับของโปรเจกต์**
  (โค้ดล้วนใน `js/art/`) — โดยสไตล์การ์ตูนแบน ไม่มีการคัดลอกภาพจากสำรับใด
- อ้างอิงเฉพาะ **สัญลักษณ์มาตรฐานของไพ่** (ข้อเท็จจริงสาธารณะ) จาก
  [Major Arcana — Wikipedia](https://en.wikipedia.org/wiki/Major_Arcana)
  และข้อมูลเทศกาลจาก [Songkran (Thailand)](https://en.wikipedia.org/wiki/Songkran_(Thailand)) /
  [Loy Krathong](https://en.wikipedia.org/wiki/Loy_Krathong)
- รายละเอียดระบบศิลป์: [docs/art-reference.md](docs/art-reference.md)
- **ไม่ใช้ภาพ Rider–Waite–Smith หรือสำรับลิขสิทธิ์ใด ๆ** ตามที่เคยกำหนดไว้ในหัวข้อ Future Assets

## Wallpapers / Affiliates
- ไฟล์ภาพวอลเปเปอร์ (`assets/wallpapers/`) และสินค้าแนะนำเป็นข้อมูลตัวอย่าง (mock) ของ MVP
  เมื่อใช้ของจริงต้องผนวก attribution ของแต่ละรายการไว้ที่ไฟล์นี้

*Last Updated: 2026-09-19*
