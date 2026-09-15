# ระบบประเมินการเตรียมความพร้อมผู้เรียนอาชีวศึกษา ตามหลักสูตร ปวช./ปวส. พ.ศ. 2567
### (Vocational Student Work Readiness System - V-WRS 2567)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Curriculum](https://img.shields.io/badge/Curriculum-OVEC%202567-emerald)](https://www.vec.go.th)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Online-success)](https://viraharn2-png.github.io/vocational-readiness-system/)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fviraharn2-png%2Fvocational-readiness-system)

🌐 **ลิงก์ระบบออนไลน์พร้อมใช้งานจริง (Live Production):**
👉 **[https://viraharn2-png.github.io/vocational-readiness-system/](https://viraharn2-png.github.io/vocational-readiness-system/)**

ระบบประเมินความพร้อมสู่การทำงานและการฝึกประสบการณ์วิชาชีพ พัฒนาขึ้นตามแนวทางการจัดการเรียนรู้ฐานสมรรถนะ (Competency-Based Education) และกรอบคุณวุฒิอาชีวศึกษาแห่งชาติ พ.ศ. 2567 ของสำนักงานคณะกรรมการการอาชีวศึกษา (สอศ.) กระทรวงศึกษาธิการ

---

## 🌟 ฟีเจอร์หลักของระบบ (Key Features)

1. **ประเมินสมรรถนะ 4 มิติหลัก (16 ตัวชี้วัดมาตรฐาน สอศ. 2567)**
   - **มิติที่ 1 (DIM-01):** ด้านคุณธรรม จริยธรรม และคุณลักษณะที่พึงประสงค์ (Attitude, Ethics & Green Skills)
   - **มิติที่ 2 (DIM-02):** ด้านความรู้และทฤษฎีเชิงประยุกต์ (Applied Knowledge & AI/Digital Literacy)
   - **มิติที่ 3 (DIM-03):** ด้านทักษะการปฏิบัติงานและการสื่อสาร (Functional Practical Skills & Workplace English)
   - **มิติที่ 4 (DIM-04):** ด้านการประยุกต์ใช้และความรับผิดชอบในการทำงาน (OHS, 5S & DVE Internship Readiness)

2. **ระดับการแปลผลความพร้อม 4 ระดับ (Readiness Scoring Tiers)**
   - 🟢 **ระดับ 4: ดีเยี่ยม (Job Ready - Mastery)** 85% - 100%
   - 🔵 **ระดับ 3: ดี (Workplace Ready - Standard)** 70% - 84.9%
   - 🟡 **ระดับ 2: พอใช้ (Pre-Ready - Supervised)** 55% - 69.9%
   - 🔴 **ระดับ 1: ต้องปรับปรุง (Needs Intervention)** < 55%

3. **แดชบอร์ดแสดงผลเชิงภาพ (Visual Dashboard & Radar Chart)**
   - กราฟใยแมงมุม (Competency Radar Chart) เปรียบเทียบผลประเมินกับเกณฑ์มาตรฐานหลักสูตร 2567
   - กราฟแท่งจำแนกคะแนนเฉลี่ยร้อยละรายมิติ

4. **การวิเคราะห์ช่องว่างสมรรถนะ & คอร์สเสริม (Gap Analysis & Upskill Roadmap)**
   - ไฮไลต์จุดแข็ง (Key Strengths)
   - ชี้เป้าตัวชี้วัดที่ต้องพัฒนา พร้อมแนะนำหลักสูตรอัปสกิลรายบุคคล

5. **ใบรับรองความพร้อมสู่อาชีพ (Vocational Work Readiness Passport)**
   - จัดรูปแบบเอกสารราชการมาตรฐาน A4
   - รองรับการสั่งพิมพ์ทันที หรือบันทึกเป็น PDF เพื่อใช้แนบยื่นสถานประกอบการในการฝึกงาน/สหกิจศึกษา

---

## 🚀 วิธีการนำ Code ขึ้น GitHub (Push to GitHub)

### ขั้นตอนที่ 1: ตรวจสอบและตั้งค่า Git ในเครื่อง
เปิด PowerShell หรือ Command Prompt ในโฟลเดอร์นี้ แล้วพิมพ์:

```bash
# 1. เริ่มต้น Git repository
git init

# 2. เพิ่มไฟล์ทั้งหมดเข้าสู่ Staging
git add .

# 3. บันทึก Commit แรก
git commit -m "feat: initial commit Vocational Student Work Readiness System (V-WRS 2567)"

# 4. ตั้งค่าชื่อ Branch หลักเป็น main
git branch -M main
```

### ขั้นตอนที่ 2: สร้าง Repository บน GitHub
1. ไปที่ [GitHub.com](https://github.com) แล้วสร้าง New Repository ตั้งชื่อเช่น `vocational-readiness-system`
2. คัดลอก URL ของ Repository ของท่าน (เช่น `https://github.com/YOUR_USERNAME/vocational-readiness-system.git`)

### ขั้นตอนที่ 3: เชื่อมต่อและ Push ขึ้น GitHub
```bash
# นำ URL จาก GitHub มาวางแทนที่ลิงก์ด้านล่าง
git remote add origin https://github.com/YOUR_USERNAME/vocational-readiness-system.git

# Push โค้ดขึ้น GitHub
git push -u origin main
```

---

## ⚡ วิธีการ Deploy ขึ้น Vercel (Deploy to Vercel)

โปรเจกต์นี้ได้รับการออกแบบเป็น Static Web App พร้อมไฟล์ `vercel.json` จึงสามารถ Deploy บน Vercel ได้แบบ **Zero-Config** โดยไม่มีปัญหาเรื่อง Dependency หรือ Build failure

### วิธีที่ 1: Deploy ผ่านหน้าเว็บ Vercel (แนะนำ - ง่ายที่สุด)
1. ไปที่ [Vercel Dashboard](https://vercel.com/dashboard)
2. คลิกปุ่ม **"Add New..."** -> **"Project"**
3. เลือก Repository `vocational-readiness-system` ที่เพิ่ง Push ขึ้น GitHub
4. ในส่วน **Framework Preset** ให้เลือกเป็น **"Other"** (หรือปล่อย Default)
5. คลิกปุ่ม **"Deploy"**
6. ภายใน 10 วินาที ระบบจะออนไลน์และมอบ URL ให้ใช้งานทันที เช่น `https://vocational-readiness-system.vercel.app`

### วิธีที่ 2: Deploy ผ่าน Vercel CLI (ทางเลือก)
หากมี `npm` หรือติดตั้ง Vercel CLI:
```bash
npm install -g vercel
vercel login
vercel --prod
```

---

## 💻 การทดสอบใช้งานในเครื่อง (Local Run)

ท่านสามารถดับเบิลคลิกเปิดไฟล์ `index.html` ใน Google Chrome หรือ Microsoft Edge เพื่อเริ่มใช้งานได้ทันทีโดยไม่ต้องรันเซิร์ฟเวอร์ หรือใช้ Local Server:
```bash
npx serve .
```

---

## 📑 โครงสร้างไฟล์ในโครงการ

```
vocational-readiness-system/
├── index.html            # โครงสร้างหน้าเว็บหลักและแท็บประเมิน
├── vercel.json           # การตั้งค่าสำหรับ Vercel Deployment & Security Headers
├── package.json          # ข้อมูล Metadata ของโปรเจกต์
├── .gitignore            # ไฟล์ยกเว้นสำหรับ Git
├── README.md             # คู่มือการใช้งานและวิธี Deploy
├── css/
│   └── style.css         # สไตล์สำหรับระบบประเมินและการจัดหน้าพิมพ์เอกสาร A4
└── js/
    ├── curriculum-data.js # ฐานข้อมูลสมรรถนะ 4 มิติ 16 ตัวชี้วัด และ Rubrics 2567
    └── app.js            # ตรรกะการประเมิน, คำนวณผล, เรนเดอร์กราฟ Radar/Bar, และเซฟข้อมูล
```

---

จัดทำขึ้นเพื่อสนับสนุนการจัดการศึกษาอาชีวศึกษาฐานสมรรถนะตามหลักสูตร พ.ศ. 2567 สอศ.
