# دليل رفع مشروع Next.js على Hostinger VPS

بما أن مشروعك يستخدم **Next.js** مع قاعدة بيانات **SQLite**، فإن أفضل خيار هو استخدام خادم افتراضي خاص (**VPS**) على Hostinger، حيث يمنحك تحكماً كاملاً لتشغيل Node.js.

فيما يلي الخطوات التفصيلية لرفع الموقع:

## 1. تجهيز الخادم (VPS Setup)

1.  ادخل على لوحة تحكم Hostinger واختر **VPS**.
2.  اختر نظام التشغيل **Ubuntu 22.04 (64-bit)** (أو أحدث).
3.  بعد اكتمال التثبيت، ستظهر لك بيانات الدخول (IP Address, Username: root, Password).
4.  افتح الـ Terminal على جهازك (أو استخدم PuTTY) لتدخل على الخادم:
    ```bash
    ssh root@YOUR_SERVER_IP
    ```

## 2. تثبيت البرامج الأساسية (Node.js & Nginx)

بمجرد الدخول، نفذ الأوامر التالية لتحديث النظام وتثبيت الأدوات:

```bash
# تحديث النظام
sudo apt update && sudo apt upgrade -y

# تثبيت Node.js (إصدار حديث، مثلاً 20)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# التحقق من التثبيت
node -v
npm -v

# تثبيت Nginx (Web Server)
sudo apt install -y nginx

# تثبيت Git
sudo apt install -y git
```

## 3. رفع ملفات المشروع

لديك طريقتان: إما عبر Git (الأفضل) أو رفع الملفات يدوياً (SFTP).

### الطريقة الأولى: باستخدام Git (مستحسن)
1.  ارفع مشروعك على GitHub (تأكد أن المستودع Private أو Public حسب رغبتك).
2.  في الخادم، انسخ المشروع:
    ```bash
    cd /var/www
    git clone https://github.com/YOUR_USERNAME/diafat-khulud.git
    cd diafat-khulud
    ```

### الطريقة الثانية: رفع الملفات يدوياً (FileZilla)
1.  استخدم برنامج **FileZilla**.
2.  اتصل بالخادم (SFTP) باستخدام الـ IP والـ Root password.
3.  ارفع ملفات المشروع إلى المسار `/var/www/diafat-khulud`.
    - **مهم:** لا ترفع مجلد `node_modules` أو `.next` أو `.git`.

## 4. إعداد المشروع

بعد نقل الملفات، عد إلى الـ Terminal في الخادم:

```bash
# اذهب لمجلد المشروع
cd /var/www/diafat-khulud

# تثبيت المكتبات
npm install

# بناء قاعدة البيانات (Prisma)
npx prisma generate
npx prisma db push

# بناء المشروع وتشغيله للتجربة
npm run build
npm start
```
*إذا اشتغل الموقع، اضغط `Ctrl + C` لإيقافه والانتقال للخطوة التالية.*

## 5. إعداد متغيرات البيئة (.env)

تحتاج لإنشاء ملف `.env` على الخادم:

```bash
nano .env
```
أضف المتغيرات الخاصة بك (نفس الموجودة في `.env.local` لديك، لكن عدلها للإنتاج):

```env
DATABASE_URL="file:./prod.db"
NEXTAUTH_URL="http://YOUR_SERVER_IP" # غيرها لاسم النطاق لاحقاً
NEXTAUTH_SECRET="your-secret-key"
# ... وباقي المتغيرات
```
اضغط `Ctrl + X` ثم `Y` ثم `Enter` للحفظ.

## 6. تشغيل الموقع بشكل دائم (PM2)

نستخدم PM2 لإبقاء الموقع يعمل في الخلفية:

```bash
# تثبيت PM2
sudo npm install -g pm2

# تشغيل المشروع
pm2 start npm --name "diafat-khulud" -- start

# حفظ القائمة لتعمل عند إعادة تشغيل الخادم
pm2 save
pm2 startup
```

## 7. ربط النطاق (Domain) و إعداد Nginx

1.  في لوحة تحكم النطاق (DNS)، أضف **A Record** يشير إلى IP الخادم الخاص بك (`@` -> `YOUR_SERVER_IP`).

2.  إعداد Nginx ليعمل كـ Reverse Proxy:

```bash
# حذف الإعداد الافتراضي
sudo rm /etc/nginx/sites-enabled/default

# إنشاء ملف إعداد جديد
sudo nano /etc/nginx/sites-available/diafat-khulud
```

ألصق المحتوى التالي (غير `your-domain.com` بنطاقك):

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

3.  تفعيل الإعداد وإعادة تشغيل Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/diafat-khulud /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 8. تفعيل SSL (HTTPS)

لحماية الموقع وفتحه عبر HTTPS:

```bash
# تثبيت Certbot
sudo apt install -y certbot python3-certbot-nginx

# استخلاص الشهادة
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```
اتبع التعليمات، وسيتم تفعيل HTTPS تلقائياً.

---
**مبروك!** موقعك الآن يعمل على VPS بنجاح.
