import type { Metadata } from "next";
import { Cairo } from "next/font/google"; // Import Cairo
import "./globals.css";

const cairo = Cairo({
    subsets: ["arabic"],
    weight: ["300", "400", "500", "700", "900"],
    variable: "--font-cairo",
    display: "swap",
});

export const metadata: Metadata = {
    // ... metadata
    title: "ضيافة خلود | للحج والعمرة",
    description: "منصة ضيافة خلود لحجز رحلات الحج والعمرة - أفضل الباقات بأسعار مميزة وخدمات متكاملة",
    keywords: ["حج", "عمرة", "سياحة دينية", "مكة", "المدينة", "رحلات دينية", "ضيافة خلود"],
    authors: [{ name: "Diafat Khulud" }],
    openGraph: {
        title: "ضيافة خلود | للحج والعمرة",
        description: "منصة ضيافة خلود لحجز رحلات الحج والعمرة",
        type: "website",
        locale: "ar_SA",
    },
};

import { ClientProviders } from "@/components/Providers";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ar" dir="rtl" className={cairo.variable}>
            <head>
                {/* Preconnects removed as Next/Font handles it */}
            </head>
            <body className="font-cairo antialiased">
                <ClientProviders>
                    {children}
                </ClientProviders>
            </body>
        </html>
    );
}
