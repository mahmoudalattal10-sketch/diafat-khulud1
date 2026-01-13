'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AuthCard, AuthInput, AuthSubmit, SocialAuth } from '@/components/auth/AuthComponents';
import { User, Mail, Phone, Lock, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RegisterPage() {
    return (
        <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#FAFAFA]" dir="rtl">
            {/* Immersive Background */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070"
                    alt="Luxury Hotel"
                    fill
                    className="object-cover scale-110 blur-[2px]"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-[#FAFAFA]" />
            </div>

            {/* Content */}
            <div className="relative z-10 w-full px-6 flex flex-col items-center py-20">

                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-12"
                >
                    <Link href="/">
                        <div className="bg-white/10 backdrop-blur-xl px-8 py-4 rounded-3xl border border-white/20 shadow-2xl flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center text-2xl">🕋</div>
                            <span className="text-2xl font-black text-white">ضيافة خلود</span>
                        </div>
                    </Link>
                </motion.div>

                <AuthCard
                    title="انضم لعائلة خلود"
                    subtitle="أنشئ حسابك الآن وابدأ تجربة حجز استثنائية"
                >
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                            <AuthInput
                                label="الاسم الكامل"
                                placeholder="اسمك الكريم"
                                icon={User}
                            />
                            <AuthInput
                                label="البريد الإلكتروني"
                                placeholder="name@example.com"
                                icon={Mail}
                                type="email"
                            />
                        </div>
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

                        <div className="mb-8">
                            <label className="flex items-start gap-3 cursor-pointer">
                                <input type="checkbox" className="mt-1 w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                                <span className="text-sm font-bold text-gray-500 leading-relaxed">
                                    أوافق على <Link href="#" className="text-primary-600 hover:underline">شروط الاستخدام</Link> و <Link href="#" className="text-primary-600 hover:underline">سياسة الخصوصية</Link>
                                </span>
                            </label>
                        </div>

                        <AuthSubmit label="إنشاء حساب جديد" />

                        <SocialAuth />

                        <div className="mt-10 text-center">
                            <p className="text-gray-500 font-medium">
                                لديك حساب بالفعل؟{' '}
                                <Link href="/login" className="text-primary-600 font-black hover:underline underline-offset-4">تسجيل الدخول</Link>
                            </p>
                        </div>
                    </form>
                </AuthCard>

                {/* Bottom Stats */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-10 flex gap-8"
                >
                    <div className="text-center">
                        <div className="text-white font-black text-xl">50K+</div>
                        <div className="text-white/50 text-[10px] uppercase tracking-widest font-bold">مستخدم سعيد</div>
                    </div>
                    <div className="w-px h-10 bg-white/10" />
                    <div className="text-center">
                        <div className="text-white font-black text-xl">4.9/5</div>
                        <div className="text-white/50 text-[10px] uppercase tracking-widest font-bold">تقييم الخدمة</div>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
