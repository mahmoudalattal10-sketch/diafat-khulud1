'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AuthCard, AuthInput, AuthSubmit, SocialAuth } from '@/components/auth/AuthComponents';
import { Phone, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
    return (
        <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#FAFAFA]" dir="rtl">
            {/* Immersive Background */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=2070"
                    alt="Makkah"
                    fill
                    className="object-cover scale-110 blur-[2px]"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-[#FAFAFA]" />
            </div>

            {/* Content */}
            <div className="relative z-10 w-full px-6 flex flex-col items-center">

                {/* Logo / Home Link */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <Link href="/">
                        <div className="bg-white/10 backdrop-blur-xl px-8 py-4 rounded-3xl border border-white/20 shadow-2xl flex items-center gap-4 group">
                            <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center text-2xl group-hover:rotate-12 transition-transform">🕋</div>
                            <span className="text-2xl font-black text-white">ضيافة خلود</span>
                        </div>
                    </Link>
                </motion.div>

                <AuthCard
                    title="مرحباً بك مجدداً"
                    subtitle="سجل دخولك لتبدأ رحلتك الروحانية معنا"
                >
                    <form onSubmit={(e) => e.preventDefault()}>
                        <AuthInput
                            label="رقم الجوال"
                            placeholder="05XXXXXXXX"
                            icon={Phone}
                            type="tel"
                        />
                        <AuthInput
                            label="كلمة المرور"
                            placeholder="••••••••"
                            icon={Lock}
                            type="password"
                        />

                        <div className="flex items-center justify-between mb-8">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                                <span className="text-sm font-bold text-gray-500">تذكرني</span>
                            </label>
                            <Link href="#" className="text-sm font-bold text-primary-600 hover:text-primary-700">نسيت كلمة المرور؟</Link>
                        </div>

                        <AuthSubmit label="تسجيل الدخول" />

                        <SocialAuth />

                        <div className="mt-10 text-center">
                            <p className="text-gray-500 font-medium">
                                ليس لديك حساب؟{' '}
                                <Link href="/register" className="text-primary-600 font-black hover:underline underline-offset-4">إنشاء حساب جديد</Link>
                            </p>
                        </div>
                    </form>
                </AuthCard>

                {/* Bottom Badge */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-md rounded-full border border-white/10 text-gray-400 text-[10px] font-black uppercase tracking-[0.3em]"
                >
                    <Sparkles size={14} className="text-primary-500/50" />
                    <span>تشفير بيانات آمن 100% بنظام ضيافة خلود</span>
                </motion.div>
            </div>
        </main>
    );
}
