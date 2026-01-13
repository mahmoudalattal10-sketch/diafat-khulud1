'use client';

import { motion } from 'framer-motion';
import { Mail, ArrowRight, Instagram, Twitter, Facebook, Linkedin, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="relative bg-[#F3F6F6] pt-20 pb-6 px-3 overflow-hidden">
            {/* Background Blob */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-white via-primary-50/30 to-transparent opacity-80 pointer-events-none" />

            <div className="max-w-[98%] mx-auto relative z-10 flex flex-col items-center">

                {/* 1. Professional CTA Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="w-full max-w-5xl bg-gradient-to-br from-primary-900 via-primary-800 to-black rounded-[2.5rem] p-10 md:p-14 text-center text-white shadow-2xl shadow-primary-900/20 mb-12 relative overflow-hidden"
                >
                    {/* Decorative Circles */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
                            جاهز لرحلة <span className="text-primary-400">العمر</span>؟
                        </h2>
                        <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
                            اجعل رحلتك القادمة إلى مكة والمدينة تجربة لا تُنسى. نحن نهتم بكل التفاصيل لتتفرغ أنت للعبادة.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button className="w-full sm:w-auto px-8 py-4 bg-primary-500 hover:bg-primary-600 text-black font-bold rounded-xl shadow-lg shadow-primary-500/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
                                <span>ابدأ تخطيط رحلتك</span>
                                <ArrowRight size={20} />
                            </button>
                            <button className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold rounded-xl border border-white/10 transition-all hover:scale-105 active:scale-95">
                                تواصل معنا
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* 2. Wide Rounded Footer Container */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="w-full bg-white rounded-[3rem] p-8 md:p-16 shadow-xl shadow-gray-200/50 border border-white/50"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

                        {/* Branding & Info */}
                        <div className="lg:col-span-4 flex flex-col gap-8">
                            <div>
                                <h3 className="text-3xl font-black text-gray-900 flex items-center gap-3 mb-5">
                                    <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-2xl">🕋</div>
                                    <span>ضيافة خلود</span>
                                </h3>
                                <p className="text-gray-500 leading-relaxed font-medium text-lg">
                                    نسعى لتقديم أرقى خدمات الضيافة لضيوف الرحمن، مع باقات متنوعة تناسب كافة الاحتياجات وبأفضل الأسعار التنافسية.
                                </p>
                            </div>

                            <div className="flex flex-col gap-4">
                                <a href="#" className="flex items-center gap-3 text-gray-600 hover:text-primary-600 transition-colors bg-gray-50 p-3 rounded-2xl w-fit">
                                    <Phone size={20} className="text-secondary-500" />
                                    <span className="font-bold dir-ltr">+966 50 123 4567</span>
                                </a>
                                <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-2xl w-fit">
                                    <MapPin size={20} className="text-secondary-500" />
                                    <span>مكة المكرمة، المملكة العربية السعودية</span>
                                </div>
                            </div>
                        </div>

                        {/* Newsletter & Links */}
                        <div className="lg:col-span-8 flex flex-col gap-12">

                            {/* Newsletter Bar */}
                            <div className="bg-gray-50 rounded-[2rem] p-8 flex flex-col md:flex-row items-center gap-6 border border-gray-100">
                                <div className="flex-1 text-center md:text-right">
                                    <h4 className="font-bold text-xl text-gray-900 mb-2">اشترك في قائمتنا البريدية</h4>
                                    <p className="text-gray-500">احصل على عروض حصرية وخصومات فورية على حجوزاتك.</p>
                                </div>
                                <form className="w-full md:w-auto flex gap-2">
                                    <div className="relative">
                                        <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="email"
                                            placeholder="بريدك الإلكتروني"
                                            className="w-full md:w-80 bg-white border border-gray-200 rounded-xl px-4 py-4 pr-12 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                        />
                                    </div>
                                    <button className="bg-gray-900 hover:bg-black text-white px-8 rounded-xl font-bold transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-gray-900/10">
                                        اشتراك
                                    </button>
                                </form>
                            </div>

                            {/* Links Columns */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                <div className="flex flex-col gap-6">
                                    <h4 className="font-bold text-lg text-gray-900">عن الشركة</h4>
                                    <ul className="flex flex-col gap-4 text-gray-500 font-medium">
                                        {['من نحن', 'فريق العمل', 'الوظائف', 'الشركاء'].map(item => (
                                            <li key={item}><Link href="#" className="hover:text-primary-600 transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-primary-500 transition-colors" />{item}</Link></li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="flex flex-col gap-6">
                                    <h4 className="font-bold text-lg text-gray-900">خدماتنا</h4>
                                    <ul className="flex flex-col gap-4 text-gray-500 font-medium">
                                        {['حجوزات الفنادق', 'نقل ومواصلات', 'إصدار التأشيرات', 'برامج سياحية'].map(item => (
                                            <li key={item}><Link href="#" className="hover:text-primary-600 transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-primary-500 transition-colors" />{item}</Link></li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="flex flex-col gap-6">
                                    <h4 className="font-bold text-lg text-gray-900">الدعم</h4>
                                    <ul className="flex flex-col gap-4 text-gray-500 font-medium">
                                        {['مركز المساعدة', 'الأسئلة الشائعة', 'سياسة الخصوصية', 'الشروط والأحكام'].map(item => (
                                            <li key={item}><Link href="#" className="hover:text-primary-600 transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-primary-500 transition-colors" />{item}</Link></li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="flex flex-col gap-6">
                                    <h4 className="font-bold text-lg text-gray-900">تواصل معنا</h4>
                                    <div className="flex gap-3">
                                        {[Twitter, Instagram, Linkedin, Facebook].map((Icon, i) => (
                                            <Link key={i} href="#" className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-primary-600 hover:text-white transition-all transform hover:rotate-6">
                                                <Icon size={20} />
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Bottom */}
                    <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-gray-400 font-medium">
                            © 2026 جميع الحقوق محفوظة لـ <span className="text-primary-700 font-bold">ضيافة خلود</span>.
                        </p>
                        <div className="flex gap-6 text-sm text-gray-400 font-medium">
                            <Link href="#" className="hover:text-primary-600 transition-colors">الخصوصية</Link>
                            <Link href="#" className="hover:text-primary-600 transition-colors">الشروط</Link>
                            <Link href="#" className="hover:text-primary-600 transition-colors">خريطة الموقع</Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
}
