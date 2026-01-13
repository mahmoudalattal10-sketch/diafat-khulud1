# Diafat Khulud (ضيافة خلود) 🏨

منصة حجز فنادق حديثة ومتطورة، مصممة خصيصاً لتوفير تجربة حجز سلسة وسريعة للمستخدمين، مع لوحة تحكم متكاملة للإدارة.

![Diafat Khulud](https://placehold.co/1200x600/e2e8f0/1e293b?text=Diafat+Khulud+Preview)

## ✨ المميزات | Features

- **أداء عالي (High Performance)**: مبني بأحدث تقنيات Next.js 14 App Router.
- **تجربة مستخدم استثنائية (UX)**: تصميم عصري (Glassmorphism) مع رسوم متحركة سلسة (Framer Motion).
- **حجز فوري وآمن**: تكامل مع بوابات دفع إلكتروني (PayTabs).
- **إدارة متكاملة**: لوحة تحكم للمدير لإضافة الفنادق، إدارة الحجوزات، والعملاء.
- **خرائط تفاعلية**: تكامل مع خرائط جوجل لعرض مواقع الفنادق بدقة.
- **متعدد اللغات**: يدعم اللغة العربية (RTL) بشكل أساسي.

## 🛠️ التقنيات المستخدمة | Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend**: Next.js Server Actions, API Routes.
- **Database**: SQLite, Prisma ORM.
- **State Management**: Zustand.
- **Authentication**: NextAuth.js v5.

## 🚀 التشغيل | Setup & Installation

Follow these steps to run the project locally:

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/diafat-khulud.git
    cd diafat-khulud
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Setup Environment Variables**:
    Copy `.env.local` to `.env` and fill in the required values (Database URL, NextAuth Secret, PayTabs keys).

4.  **Initialize Database**:
    ```bash
    npx prisma generate
    npx prisma db push
    ```

5.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## ☁️ الرفع والنشر | Deployment

تم إعداد أدلة شاملة لطريقة الرفع على استضافة **Hostinger**:

*   📄 **[دليل الاستضافة السحابية (Hostinger Cloud Guide)](./HOSTINGER_CLOUD_GUIDE_AR.md)** - *موصى به*
*   📄 **[دليل السيرفر الخاص (VPS Deployment Guide)](./HOSTINGER_GUIDE_AR.md)**

## 📚 التوثيق | Documentation

*   **[تفاصيل المشروع التقنية (Project Specs)](./PROJECT_SPECS_AR.md)**
*   **[هيكلة المشروع (Project Architecture)](./PROJECT_ARCHITECTURE_AR.md)**

---
Developed with ❤️ by **[Your Name/Team]**.
