# توثيق هيكلة المشروع (Project Architecture Documentation)

هذا الملف يحتوي على شرح تفصيلي لهيكلة المشروع، التقنيات المستخدمة، ونمط التصميم (Design Pattern)، لغرض المراجعة التقنية (Code Review).

## 1. نظرة عامة (Overview)

المشروع عبارة عن منصة حجز فنادق (Diafat Khulud) مبنية باستخدام **Next.js 14** (أحدث إصدار) مع معمارية **App Router**. يهدف المشروع إلى الأداء العالي، الأمان، وتجربة مستخدم سلسة (SPA-like experience).

*   **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion.
*   **Backend**: Next.js Server Actions & API Routes.
*   **Database**: SQLite (via Prisma ORM).
*   **State Management**: Zustand.
*   **Authentication**: NextAuth.js (v5).

## 2. هيكلة الملفات (Directory Structure)

```
diafat-khulud/
├── prisma/                 # إعدادات قاعدة البيانات
│   ├── schema.prisma       # مخطط البيانات (Models: User, Hotel, Booking...)
│   └── dev.db              # ملف قاعدة البيانات (SQLite)
├── public/                 # الملفات الثابتة (Images, Fonts)
├── scripts/                # سكريبتات مساعدة (Seeding, Optimization)
├── src/
│   ├── app/                # (App Router) الصفحات والمسارات
│   │   ├── admin/          # لوحة التحكم (محمية بـ Middleware)
│   │   ├── api/            # نقاط الاتصال (REST Endpoints for external hooks)
│   │   ├── auth/           # صفحات تسجيل الدخول وإنشاء الحساب
│   │   ├── hotels/         # صفحات تصفح وتفاصيل الفنادق
│   │   ├── payment/        # صفحات الدفع (Callback & Return)
│   │   ├── layout.tsx      # التخطيط العام (Root Layout)
│   │   └── page.tsx        # الصفحة الرئيسية
│   ├── components/         # مكونات واجهة المستخدم (Reusable Components)
│   │   ├── ui/             # مكونات التصميم الأساسية (Buttons, Inputs...)
│   │   ├── hotels/         # مكونات خاصة بالفنادق (Cards, Filters...)
│   │   └── admin/          # مكونات لوحة التحكم
│   ├── lib/                # دوال المساعدة (Utility Functions)
│   │   ├── mail.ts         # إعدادات إرسال الإيميلات (Nodemailer)
│   │   ├── paytabs.ts      # الربط مع بوابة الدفع (PayTabs)
│   │   └── pricing.ts      # منطق حساب الأسعار
│   ├── store/              # إدارة الحالة (Global State - Zustand)
│   │   ├── bookingsStore.ts
│   │   └── hotelsStore.ts
│   ├── types/              # تعريفات الأنواع (TypeScript Interfaces)
│   └── middleware.ts       # حماية المسارات (Route Guard)
├── next.config.mjs         # إعدادات Next.js (Standalone Output)
├── tailwind.config.ts      # إعدادات التصميم
└── package.json            # المكتبات والسكريبتات
```

## 3. أنماط التصميم (Design Patterns) & Architecture

### أ. Server vs Client Components
نعتمد مبدأ **"Server First"** لتحسين الـ SEO والأداء:
*   **Server Components**: تستخدم افتراضياً في جميع الصفحات (`page.tsx`) لجلب البيانات مباشرة من قاعدة البيانات دون الحاجة لـ API داخلي.
*   **Client Components**: تستخدم فقط عند الحاجة للتفاعل (Interactivity) مثل الأزرار، النماذج (Forms)، والـ Hooks (`useState`, `useEffect`)، ويتم تمييزها بـ `'use client'`.

### ب. إدارة الحالة (State Management)
نستخدم **Zustand** بدلاً من Redux أو Context API لسهولته وسرعته.
*   يستخدم لتخزين بيانات سلة الحجز، الفلاتر، وبيانات المستخدم المؤقتة.

### ج. قاعدة البيانات (Database Layer)
نستخدم **Prisma ORM** كطبقة تجريد (Abstraction Layer) للتعامل مع قاعدة البيانات.
*   يضمن **Type Safety** كاملة.
*   يسهل الانتقال مستقبلاً إلى PostgreSQL أو MySQL دون تغيير كود التطبيق.

### د. الأمان (Security)
*   **Zod**: يستخدم للتحقق من صحة البيانات (Validation) في جميع النماذج والـ API Inputs.
*   **Middleware**: يقوم بفحص الـ Session Cookie قبل السماح بالدخول لصفحات `/admin` أو `/profile`.

## 4. التكاملات الخارجية (Integrations)

*   **PayTabs**: تم بناء `src/lib/paytabs.ts` للتعامل مع إنشاء روابط الدفع والتحقق من صحة المعاملات (IPN/Callback).
*   **Nodemailer**: لإرسال إشعارات تأكيد الحجز للمستخدم وللإدارة.

## 5. الجاهزية للإنتاج (Production Readiness)

*   تم تفعيل **SQLite WAL Mode** لضمان التزامن العالي.
*   تم استخدام **sharp** لتحسين الصور تلقائياً.
*   المشروع مهيأ ليعمل كـ **Standalone Build** أو على **Docker**.
