'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    Phone,
    Mail,
    MessageSquare,
    MapPin,
    Clock,
    ChevronRight,
    Send,
    Globe,
    ShieldCheck,
    Sparkles
} from 'lucide-react';
import Image from 'next/image';

// --- Creative Artistic Hero ---
export function ContactHero() {
    return (
        <section className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden bg-[#FAFAFA]" dir="rtl">

            {/* 1. Animated Liquid Background Layer */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(197,160,89,0.05),transparent_50%)]" />

                {/* Flowing Liquid Gold Shapes */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                        x: [0, 100, 0],
                        y: [0, -50, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary-100/30 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [90, 0, 90],
                        x: [0, -100, 0],
                        y: [0, 100, 0]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-40 -left-40 w-[700px] h-[700px] bg-emerald-100/20 rounded-full blur-[140px]"
                />
            </div>

            {/* 2. Parallax Image Layer */}
            <motion.div
                style={{ y: '10%' }}
                className="absolute inset-0 z-1 opacity-20 pointer-events-none"
            >
                <Image
                    src="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=2070"
                    alt="Artistic Pattern"
                    fill
                    className="object-cover grayscale mix-blend-overlay"
                />
            </motion.div>

            {/* 3. Floating Glass Elements (The "Creative" touch) */}
            <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
                <FloatingGlassCard delay={0} x="10%" y="20%" rotate={-15} scale={1.2} />
                <FloatingGlassCard delay={0.5} x="85%" y="15%" rotate={10} scale={0.8} />
                <FloatingGlassCard delay={1} x="75%" y="70%" rotate={-5} scale={1.1} />
                <FloatingGlassCard delay={1.5} x="5%" y="75%" rotate={20} scale={0.9} />
            </div>

            {/* 4. Main Content Layer */}
            <div className="relative z-20 max-w-6xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="space-y-12"
                >
                    <div className="relative inline-block">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            className="absolute -inset-8 border border-dashed border-primary-500/20 rounded-full"
                        />
                        <span className="relative z-10 inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/40 backdrop-blur-xl border border-white/60 shadow-xl text-primary-600 text-[11px] font-black uppercase tracking-[0.5em]">
                            <Sparkles size={16} className="text-primary-500" />
                            <span>نحن نبني جسور التواصل</span>
                        </span>
                    </div>

                    <h1 className="text-6xl md:text-[120px] font-black leading-[0.9] tracking-tighter text-gray-900 font-display">
                        <span className="block mb-4">ليكن تواصلنا</span>
                        <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-primary-300 to-primary-700 animate-gradient-x">
                            أثراً خالداً
                            <div className="absolute -bottom-4 left-0 w-full h-2 bg-primary-500/10 blur-sm rounded-full" />
                        </span>
                    </h1>

                    <p className="max-w-xl mx-auto text-xl md:text-2xl font-medium text-gray-500 leading-relaxed italic">
                        "في ضيافة خلود، نؤمن أن كل تساؤل هو فرصة لنخدم شعيرة عظيمة. فريقنا يضع قلبه قبل يده في خدمتك."
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
                        <button className="h-20 px-12 bg-gray-900 hover:bg-black text-white rounded-[2rem] font-black text-lg shadow-[0_20px_40px_rgba(0,0,0,0.2)] transition-all hover:scale-105 active:scale-95 flex items-center gap-3 group">
                            <span>ابدأ المحادثة</span>
                            <Send size={20} className="group-hover:translate-x-[-4px] group-hover:-translate-y-1 transition-transform" />
                        </button>
                        <button className="h-20 px-12 bg-white/40 backdrop-blur-xl border-2 border-primary-500/20 text-primary-600 rounded-[2rem] font-black text-lg transition-all hover:bg-primary-50 flex items-center gap-3">
                            <span>مركز المساعدة</span>
                            <Globe size={20} />
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30"
            >
                <div className="w-[1px] h-12 bg-gradient-to-b from-primary-500 to-transparent" />
                <span className="text-[10px] font-black uppercase tracking-widest text-primary-600">اكتشف المزيد</span>
            </motion.div>
        </section>
    );
}

function FloatingGlassCard({ x, y, rotate, scale, delay }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{
                opacity: 0.15,
                scale: scale,
                y: [0, -20, 0],
                rotate: [rotate, rotate + 5, rotate]
            }}
            transition={{
                opacity: { duration: 1, delay },
                scale: { duration: 1, delay },
                y: { duration: 5 + delay, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 7 + delay, repeat: Infinity, ease: "easeInOut" }
            }}
            style={{ left: x, top: y }}
            className="absolute w-64 h-80 rounded-[3rem] bg-gradient-to-br from-white/80 to-primary-500/10 backdrop-blur-3xl border border-white shadow-2xl skew-x-3"
        />
    );
}

// --- Contact Matrix (The Cards) ---
export function ContactMatrix() {
    const channels = [
        {
            icon: <Phone size={28} />,
            title: "اتصال مباشر",
            value: "966501234567+",
            sub: "متاح 24/7",
            action: "tel:+966501234567",
            color: "primary"
        },
        {
            icon: <MessageSquare size={28} />,
            title: "واتساب مباشر",
            value: "ابدأ محادثة فورية",
            sub: "رد سريع خلال دقائق",
            action: "https://wa.me/966501234567",
            color: "emerald"
        },
        {
            icon: <Mail size={28} />,
            title: "البريد الإلكتروني",
            value: "info@khulud.com",
            sub: "تواصل رسمي وموثق",
            action: "mailto:info@khulud.com",
            color: "indigo"
        }
    ];

    return (
        <section className="relative z-20 -mt-24 px-6 mb-24">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {channels.map((c, i) => (
                        <motion.a
                            key={i}
                            href={c.action}
                            target="_blank"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="group bg-white/70 backdrop-blur-2xl p-10 rounded-[3rem] border border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_rgba(197,160,89,0.1)] hover:-translate-y-3 transition-all duration-500 text-center flex flex-col items-center"
                        >
                            <div className="w-20 h-20 rounded-[2rem] bg-gray-50 flex items-center justify-center text-primary-600 mb-8 group-hover:bg-primary-600 group-hover:text-white transition-all duration-500 shadow-inner">
                                {c.icon}
                            </div>
                            <h3 className="text-xl font-black text-gray-900 mb-2">{c.title}</h3>
                            <span className="text-2xl font-black text-primary-700 block mb-2">{c.value}</span>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{c.sub}</span>
                        </motion.a>
                    ))}
                </div>
            </div>
        </section>
    );
}

// --- Premium Contact Form ---
export function ContactForm() {
    return (
        <section className="py-24 px-6 bg-[#FDFDFD]">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20">

                {/* Text Side */}
                <div className="flex-1 space-y-10">
                    <div>
                        <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest block mb-4">راسلنا الآن</span>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">شاركنا استفسارك، <br /> وسنتولى الباقي.</h2>
                    </div>

                    <div className="space-y-8">
                        <ContactBenefit
                            icon={<Clock size={20} />}
                            title="استجابة فائقة السرعة"
                            desc="نلتزم بالرد على كافة الاستفسارات خلال أقل من ساعتين عمل."
                        />
                        <ContactBenefit
                            icon={<ShieldCheck size={20} />}
                            title="خصوصية بياناتك"
                            desc="يتم التعامل مع كافة معلوماتك بسرية تامة وتشفير بنكي عالي المستوى."
                        />
                        <ContactBenefit
                            icon={<Globe size={20} />}
                            title="دعم متعدد اللغات"
                            desc="فريقنا يخدمك بالعربية، الإنجليزية، والأردية بطلاقة تامة."
                        />
                    </div>

                    <div className="pt-10 border-t border-gray-100 flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600">
                            <MapPin size={28} />
                        </div>
                        <div>
                            <span className="text-xs font-bold text-gray-400 block mb-1">المقر الرئيسي</span>
                            <span className="text-lg font-black text-gray-900">حي النسيم، مكة المكرمة - المملكة العربية السعودية</span>
                        </div>
                    </div>
                </div>

                {/* Form Side */}
                <div className="flex-1">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-[3.5rem] p-10 md:p-14 shadow-[0_50px_100px_rgba(0,0,0,0.06)] border border-gray-50 relative overflow-hidden"
                    >
                        {/* Decorative Background Element */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-primary-500/5 rounded-full blur-[60px]" />

                        <form className="space-y-8 relative z-10" onSubmit={(e) => e.preventDefault()}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <FormInput label="الاسم بالكامل" placeholder="مثال: صالح الأحمدي" />
                                <FormInput label="رقم الجوال" placeholder="05XXXXXXXX" type="tel" />
                            </div>
                            <FormInput label="البريد الإلكتروني" placeholder="name@domain.com" type="email" />
                            <div className="space-y-3">
                                <label className="text-sm font-black text-gray-700 mr-1">موضوع الاستفسار</label>
                                <select className="w-full h-16 px-6 bg-gray-50 rounded-2xl border-2 border-transparent focus:bg-white focus:border-primary-500 transition-all outline-none font-bold text-gray-900 appearance-none">
                                    <option>استفسار عن حجز فندق</option>
                                    <option>طلب عرض سعر باقة</option>
                                    <option>ملاحظات واقتراحات</option>
                                    <option>أخرى</option>
                                </select>
                            </div>
                            <div className="space-y-3">
                                <label className="text-sm font-black text-gray-700 mr-1">رسالتك</label>
                                <textarea
                                    placeholder="اكتب ما يدور في خاطرك هنا..."
                                    className="w-full h-40 p-6 bg-gray-50 rounded-[2rem] border-2 border-transparent focus:bg-white focus:border-primary-500 transition-all outline-none font-bold text-gray-900 resize-none"
                                ></textarea>
                            </div>

                            <button className="w-full h-[76px] bg-primary-600 hover:bg-primary-700 text-white font-black rounded-2xl shadow-2xl shadow-primary-600/30 transition-all flex items-center justify-center gap-4 group active:scale-[0.98]">
                                <span className="text-lg">إرسال الرسالة</span>
                                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:translate-x-[-4px] transition-transform">
                                    <Send size={20} />
                                </div>
                            </button>
                        </form>
                    </motion.div>
                </div>

            </div>
        </section>
    );
}

function ContactBenefit({ icon, title, desc }: any) {
    return (
        <div className="flex gap-4">
            <div className="mt-1 w-6 h-6 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-600 shrink-0">
                {icon}
            </div>
            <div>
                <h4 className="font-black text-gray-900 mb-1">{title}</h4>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}

function FormInput({ label, placeholder, type = "text" }: any) {
    return (
        <div className="space-y-3">
            <label className="text-sm font-black text-gray-700 mr-1">{label}</label>
            <input
                type={type}
                placeholder={placeholder}
                className="w-full h-16 px-6 bg-gray-50 rounded-2xl border-2 border-transparent focus:bg-white focus:border-primary-500 transition-all outline-none font-bold text-gray-900"
            />
        </div>
    );
}
