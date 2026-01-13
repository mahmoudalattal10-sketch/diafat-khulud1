'use client';

import React from 'react';
import Link from 'next/link';
import { AuthCard, AuthInput, AuthSubmit } from '@/components/auth/AuthComponents';
import { User, Lock, ShieldCheck, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminLoginPage() {
    return (
        <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0A0F0D]" dir="rtl">
            {/* Geometric Technical Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(197,160,89,0.05),transparent_70%)]" />
                <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{ backgroundImage: 'radial-gradient(#C5A059 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />

                {/* Animated Orbs */}
                <motion.div
                    animate={{ x: [0, 50, 0], y: [0, 100, 0] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-40 -left-40 w-96 h-96 bg-primary-600/10 rounded-full blur-[100px]"
                />
            </div>

            {/* Content */}
            <div className="relative z-10 w-full px-6 flex flex-col items-center">

                {/* Admin Icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mb-10 w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-primary-500/30"
                >
                    <ShieldCheck size={48} />
                </motion.div>

                <AuthCard
                    title="بوابة الإدارة"
                    subtitle="لوحة التحكم المركزية - ضيافة خلود"
                >
                    <form onSubmit={(e) => e.preventDefault()}>
                        <AuthInput
                            label="اسم المستخدم أو الإيميل"
                            placeholder="admin@khulud.com"
                            icon={Mail}
                        />
                        <AuthInput
                            label="كلمة مرور الإدارة"
                            placeholder="••••••••"
                            icon={Lock}
                            type="password"
                        />

                        <div className="p-4 bg-primary-50 rounded-2xl border border-primary-100 mb-8">
                            <div className="flex gap-3">
                                <ShieldCheck size={20} className="text-primary-600 shrink-0 mt-0.5" />
                                <p className="text-xs font-bold text-primary-900 leading-relaxed">
                                    هذه المنطقة مخصصة للموظفين المصرح لهم فقط. يتم مراقبة كافة المحاولات لأغراض أمنية.
                                </p>
                            </div>
                        </div>

                        <AuthSubmit label="دخول لوحة التحكم" icon={ShieldCheck} />

                        <div className="mt-8 text-center">
                            <Link href="/" className="text-sm font-bold text-gray-400 hover:text-primary-500 transition-colors">
                                العودة للموقع الرئيسي
                            </Link>
                        </div>
                    </form>
                </AuthCard>

                {/* Security Badge */}
                <div className="mt-12 flex items-center gap-6">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest">v2.4.0</span>
                        <span className="text-[10px] font-bold text-gray-500">Enterprise Edition</span>
                    </div>
                </div>
            </div>
        </main>
    );
}
