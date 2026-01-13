# Deployment Guide

This application is built with Next.js 14 (App Router), Prisma, and SQLite.

## Environment Variables
Ensure the following environment variables are set in your production environment (e.g., Vercel, Hostinger, VPS):

```env
# Database
DATABASE_URL="file:./dev.db" # Or path to your production SQLite file

# NextAuth
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-super-secret-key-at-least-32-chars"

# PayTabs (Payment Gateway)
PAYTABS_PROFILE_ID="your_profile_id"
PAYTABS_SERVER_KEY="your_server_key"
PAYTABS_CLIENT_KEY="your_client_key"
PAYTABS_REGION="SA" # or AE, EG, etc.

# Email (Nodemailer) - Optional if mocking
# SMTP_HOST=smtp.example.com
# SMTP_PORT=587
# SMTP_USER=user
# SMTP_PASS=pass
```

## Build & Start
1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Generate Prisma Client**:
    ```bash
    npx prisma generate
    ```

3.  **Push Database Schema**:
    ```bash
    npx prisma db push
    ```

4.  **Build**:
    ```bash
    npm run build
    ```

5.  **Start Date**:
    ```bash
    npm start
    ```

## Notes for Hostinger / VPS
- If using SQLite on a serverless environment (like Vercel), note that the DB is ephemeral. For production, consider migrating to PostgreSQL or MySQL (e.g., Supabase, PlanetScale) by changing the `provider` in `prisma/schema.prisma`.
- Ensure the `public/uploads` directory (if used) is writable or use an external object storage (AWS S3) for persistent file uploads.
