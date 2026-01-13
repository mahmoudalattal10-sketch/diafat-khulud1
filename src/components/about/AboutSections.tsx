'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Sparkles, Heart, ShieldCheck, Globe, ArrowUpRight, History, Target, Eye } from 'lucide-react';
import Image from 'next/image';

// --- Highly Creative Artistic Hero ---
export function AboutHero() {
    return (
        <section className="relative h-screen min-h-[900px] flex items-center justify-center overflow-hidden bg-[#FAFAFA]" dir="rtl">

            {/* 1. Artistic Background Layers */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(197,160,89,0.08),transparent_70%)]" />

                {/* Flowing Artistic Shapes */}
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        rotate: [0, 45, 0],
                        x: [0, 150, 0],
                        y: [0, -100, 0]
                    }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-60 -right-60 w-[800px] h-[800px] bg-primary-100/40 rounded-full blur-[150px]"
                />
                <motion.div
                    animate={{
                        scale: [1.3, 1, 1.3],
                        rotate: [45, 0, 45],
                        x: [0, -150, 0],
                        y: [0, 150, 0]
                    }}
                    transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-60 -left-60 w-[900px] h-[900px] bg-emerald-100/30 rounded-full blur-[180px]"
                />
            </div>

            {/* 2. Layered Floating Glass Elements */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                <FloatingSphere delay={0} x="15%" y="25%" size="w-32 h-32" color="bg-primary-200" blur="blur-3xl" />
                <FloatingSphere delay={1} x="80%" y="35%" size="w-48 h-48" color="bg-emerald-200" blur="blur-[100px]" />
                <FloatingSphere delay={2} x="45%" y="80%" size="w-40 h-40" color="bg-primary-300" blur="blur-[120px]" />
            </div>

            {/* 3. Main Narrative Content */}
            <div className="relative z-20 max-w-7xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    className="space-y-16"
                >
                    {/* Artistic Badge */}
                    <div className="flex justify-center">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="inline-flex items-center gap-4 px-8 py-4 rounded-full bg-white/40 backdrop-blur-2xl border border-white shadow-[0_20px_40px_rgba(0,0,0,0.05)] relative group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                            <Sparkles size={20} className="text-primary-500" />
                            <span className="text-primary-600 text-xs md:text-sm font-black uppercase tracking-[0.4em]">حكاية شغف.. فصولها أنتم</span>
                        </motion.div>
                    </div>

                    {/* Grand Artistic Title */}
                    <h1 className="text-6xl md:text-[140px] font-black leading-[0.85] tracking-tighter text-gray-900 font-display">
                        <span className="block mb-6">نحن لسنا مجرد</span>
                        <span className="relative inline-block">
                            <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-primary-700 via-primary-400 to-primary-800">
                                اسم في الضيافة
                            </span>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                transition={{ delay: 0.8, duration: 1.5 }}
                                className="absolute -bottom-4 right-0 h-4 bg-primary-500/10 -z-1 skew-x-[-20deg]"
                            />
                        </span>
                    </h1>

                    {/* Creative Mission Teaser */}
                    <div className="max-w-3xl mx-auto relative group">
                        <div className="absolute -inset-8 border border-dashed border-gray-200 rounded-[3rem] group-hover:border-primary-500/30 transition-colors" />
                        <p className="relative z-10 text-2xl md:text-3xl font-medium text-gray-500 leading-relaxed italic">
                            "في ضيافة خلود، نسافر بالقلوب قبل الأجساد. نحن نرسم ملامح رحلة روحانية تليق بقدسية المكان وعظمة الزمان."
                        </p>
                    </div>

                    {/* Action Hub */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-10">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="h-20 px-14 bg-gray-900 text-white rounded-[2.5rem] font-black text-xl shadow-2xl transition-all flex items-center gap-4 group"
                        >
                            <span>اكتشف قصتنا</span>
                            <ArrowUpRight size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            className="h-20 px-14 bg-white/40 backdrop-blur-xl border border-gray-200 text-gray-600 rounded-[2.5rem] font-black text-xl hover:bg-white transition-all"
                        >
                            انضم إلينا
                        </motion.button>
                    </div>
                </motion.div>
            </div>

            {/* Artistic Parallax Background Images */}
            <div className="absolute bottom-0 left-0 w-full h-[400px] z-5 opacity-10 pointer-events-none">
                <Image
                    src="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=2070"
                    alt="Bottom Accent"
                    fill
                    className="object-cover grayscale"
                />
            </div>
        </section>
    );
}

function FloatingSphere({ x, y, size, color, blur, delay }: any) {
    return (
        <motion.div
            animate={{
                y: [0, -30, 0],
                scale: [1, 1.1, 1]
            }}
            transition={{ duration: 6 + delay, repeat: Infinity, ease: "easeInOut" }}
            style={{ left: x, top: y }}
            className={`absolute ${size} ${color} ${blur} rounded-full opacity-20`}
        />
    )
}

// --- Company Odyssey (Story) ---
export function OurOdyssey() {
    const milestones = [
        {
            id: '01',
            title: 'النواة الأولى',
            desc: 'بدأنا كحلم صغير في أزقة مكة المكرمة، مدفوعين برغبة صادقة في إكرام ضيوف الرحمن بأعلى المعايير.',
            icon: <History size={32} />
        },
        {
            id: '02',
            title: 'التحول الرقمي',
            desc: 'كنا من الأوائل في تبني الحلول الذكية، لنجعل رحلة المعتمر والحاج تبدأ بضغطة زر وبثقة مطلقة.',
            icon: <Target size={32} />
        },
        {
            id: '03',
            title: 'الريادة العالمية',
            desc: 'اليوم، نفخر بكوننا الشريك الموثوق لآلاف العائلات حول العالم، نقدم لهم سكناً يليق بروحانيتهم.',
            icon: <Eye size={32} />
        }
    ];

    return (
        <section className="py-32 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-24">
                    {/* Sticky Intro */}
                    <div className="lg:w-1/3 lg:sticky lg:top-32 h-fit">
                        <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest block mb-4">ملحمتنا</span>
                        <h2 className="text-5xl font-black text-gray-900 leading-tight mb-8">عشر سنوات من <br /> صناعة الأثر</h2>
                        <div className="p-8 bg-gray-50 rounded-[3rem] border border-gray-100">
                            <p className="text-gray-500 font-medium leading-relaxed italic border-r-4 border-primary-500 pr-6">
                                "نحن لا نحصي السنوات بالزمن، بل بابتسامة الرضا على وجوه ضيوفنا عند رؤية الكعبة المشرفة لأول مرة من شرفات فنادقنا."
                            </p>
                        </div>
                    </div>

                    {/* Vertical Odyssey */}
                    <div className="flex-1 space-y-16">
                        {milestones.map((m, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: i * 0.1 }}
                                className="group flex gap-8 items-start"
                            >
                                <div className="text-8xl font-black text-gray-100 group-hover:text-primary-500/10 transition-colors select-none shrink-0">
                                    {m.id}
                                </div>
                                <div className="pt-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 transition-transform group-hover:rotate-12">
                                            {m.icon}
                                        </div>
                                        <h3 className="text-3xl font-black text-gray-900">{m.title}</h3>
                                    </div>
                                    <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-xl">
                                        {m.desc}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

// --- Value Matrix ---
export function ValueMatrix() {
    const values = [
        { icon: <Heart size={32} />, title: 'الإخلاص', desc: 'نعمل برأس مرفوعة وقلب مؤمن بقدسية الرسالة التي نؤديها.' },
        { icon: <ShieldCheck size={32} />, title: 'الأمانة', desc: 'كل تفصيل في رحلتك هو عهد علينا نلتزم بوفائه بدقة.' },
        { icon: <Globe size={32} />, title: 'العالمية', desc: 'نتحدث لغات العالم، لنشعر كل ضيف أنه في بيته وبين أهله.' },
        { icon: <Sparkles size={32} />, title: 'الابتكار', desc: 'لا نتوقف عن تطوير أدواتنا لنبقى دائماً في طليعة المستقبل.' }
    ];

    return (
        <section className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-24">
                    <h2 className="text-5xl font-black text-gray-900 mb-6">القيم التي تحركنا</h2>
                    <div className="w-24 h-1.5 bg-primary-500 mx-auto rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {values.map((v, i) => (
                        <div key={i} className="bg-white rounded-[3rem] p-12 border border-white shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-500 group">
                            <div className="w-20 h-20 rounded-[2rem] bg-primary-50 flex items-center justify-center text-primary-600 mb-10 group-hover:scale-110 transition-transform">
                                {v.icon}
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-4">{v.title}</h3>
                            <p className="text-gray-500 font-medium leading-relaxed">
                                {v.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// --- Stats Section ---
export function StatsSection() {
    const stats = [
        { label: 'ضيف خدمناهم', value: '50K+' },
        { label: 'فندق شريك', value: '200+' },
        { label: 'عام من الخبرة', value: '10+' },
        { label: 'تقييم إيجابي', value: '4.9/5' }
    ];

    return (
        <section className="py-20 bg-primary-600 text-white overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                    {stats.map((s, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <div className="text-4xl md:text-6xl font-black mb-2">{s.value}</div>
                            <div className="text-sm md:text-lg font-bold text-primary-100 opacity-80 uppercase tracking-widest">{s.label}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}


