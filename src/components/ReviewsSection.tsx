'use client';

import { motion } from 'framer-motion';
import { Star, Quote, ThumbsUp, User, MapPin, Calendar, TrendingUp, Award, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

const reviews = [
    {
        id: 1,
        name: 'أحمد العتيبي',
        location: 'الرياض، السعودية',
        rating: 5,
        date: 'منذ أسبوع',
        hotel: 'فندق أبراج مكة',
        image: 'https://ui-avatars.com/api/?name=أحمد+العتيبي&background=0D9488&color=fff&size=200',
        review: 'تجربة استثنائية من البداية للنهاية! الحجز كان سهل وسريع، والفندق كان أفضل من التوقعات. الموقع ممتاز والخدمة راقية جداً. بالتأكيد سأحجز مرة أخرى.',
        helpful: 124,
        verified: true
    },
    {
        id: 2,
        name: 'فاطمة المطيري',
        location: 'جدة، السعودية',
        rating: 5,
        date: 'منذ 3 أيام',
        hotel: 'منتجع شرم أبحر',
        image: 'https://ui-avatars.com/api/?name=فاطمة+المطيري&background=8B5CF6&color=fff&size=200',
        review: 'أفضل موقع حجز فنادق استخدمته! الأسعار ممتازة والخيارات متنوعة. دعم العملاء محترف جداً وساعدوني في اختيار الفندق المناسب. شكراً لكم!',
        helpful: 89,
        verified: true
    },
    {
        id: 3,
        name: 'محمد الشمري',
        location: 'الدمام، السعودية',
        rating: 5,
        date: 'منذ يومين',
        hotel: 'فندق رمادا الخبر',
        image: 'https://ui-avatars.com/api/?name=محمد+الشمري&background=F59E0B&color=fff&size=200',
        review: 'منصة رائعة وسهلة الاستخدام. حجزت لعائلتي وكانت التجربة سلسة جداً. الفندق كان نظيف والإطلالة خيالية. أنصح الجميع بالحجز من هنا.',
        helpful: 156,
        verified: true
    },
    {
        id: 4,
        name: 'نورة القحطاني',
        location: 'مكة المكرمة، السعودية',
        rating: 5,
        date: 'منذ 5 أيام',
        hotel: 'فندق دار التوحيد',
        image: 'https://ui-avatars.com/api/?name=نورة+القحطاني&background=EC4899&color=fff&size=200',
        review: 'حجزت لموسم العمرة والتجربة كانت مميزة. الفندق قريب من الحرم والأسعار منافسة. شكراً لضيافة خلود على الخدمة الممتازة!',
        helpful: 203,
        verified: true
    },
    {
        id: 5,
        name: 'عبدالله السعيد',
        location: 'المدينة المنورة، السعودية',
        rating: 5,
        date: 'منذ أسبوعين',
        hotel: 'فندق أنوار المدينة',
        image: 'https://ui-avatars.com/api/?name=عبدالله+السعيد&background=3B82F6&color=fff&size=200',
        review: 'خدمة احترافية جداً! الموقع سريع والمعلومات واضحة. حجزت أكثر من مرة وفي كل مرة التجربة تكون ممتازة. أفضل منصة حجز في المملكة!',
        helpful: 178,
        verified: true
    }
];

const stats = [
    { value: '50K+', label: 'عميل راضٍ', icon: User },
    { value: '100K+', label: 'حجز ناجح', icon: Award },
    { value: '4.9/5', label: 'تقييم العملاء', icon: Star },
    { value: '98%', label: 'نسبة الرضا', icon: TrendingUp }
];

export default function ReviewsSection() {
    const [activeReview, setActiveReview] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveReview((prev) => (prev + 1) % reviews.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative py-24 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/3 rounded-full blur-3xl" />
            </div>

            <div className="container-custom relative">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full mb-6">
                        <Sparkles size={16} className="text-primary-500" />
                        <span className="text-primary-600 font-black text-sm">آراء عملائنا</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6">
                        ماذا يقول عملاؤنا؟
                    </h2>
                    <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto">
                        آلاف العملاء حول المملكة يثقون بنا لحجز رحلاتهم وإقامتهم
                    </p>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 * index }}
                            className="group relative bg-white rounded-3xl p-8 text-center border border-gray-100 hover:border-primary-200 hover:shadow-xl transition-all"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative">
                                <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                    <stat.icon size={32} className="text-primary-500" />
                                </div>
                                <div className="text-4xl font-black text-gray-900 mb-2">{stat.value}</div>
                                <div className="text-sm font-bold text-gray-500">{stat.label}</div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Reviews Grid */}
                <div className="grid lg:grid-cols-2 gap-8 mb-12">
                    {/* Featured Review (Left) */}
                    <motion.div
                        key={activeReview}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-1"
                    >
                        <div className="relative bg-gradient-to-br from-primary-500 to-primary-600 rounded-[3rem] p-10 text-white shadow-2xl shadow-primary-500/20 h-full">
                            {/* Decorative Quote */}
                            <div className="absolute top-8 right-8 w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur">
                                <Quote size={40} className="text-white/80" />
                            </div>

                            {/* Content */}
                            <div className="relative z-10 flex flex-col h-full">
                                {/* Stars */}
                                <div className="flex gap-1 mb-6">
                                    {[...Array(reviews[activeReview].rating)].map((_, i) => (
                                        <Star key={i} size={24} className="text-yellow-300 fill-yellow-300" />
                                    ))}
                                </div>

                                {/* Review Text */}
                                <p className="text-xl md:text-2xl font-medium leading-relaxed mb-8 flex-1">
                                    "{reviews[activeReview].review}"
                                </p>

                                {/* User Info */}
                                <div className="flex items-center gap-4 pt-6 border-t border-white/20">
                                    <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/30 shadow-xl">
                                        <img
                                            src={reviews[activeReview].image}
                                            alt={reviews[activeReview].name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-black text-lg">{reviews[activeReview].name}</h4>
                                            {reviews[activeReview].verified && (
                                                <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-white/80 text-sm font-medium flex items-center gap-2">
                                            <MapPin size={14} />
                                            {reviews[activeReview].location}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-white/60 font-medium">{reviews[activeReview].date}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Background Decoration */}
                            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                        </div>
                    </motion.div>

                    {/* Other Reviews (Right) */}
                    <div className="space-y-4">
                        {reviews.filter((_, idx) => idx !== activeReview).slice(0, 3).map((review, index) => (
                            <motion.div
                                key={review.id}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                onClick={() => setActiveReview(reviews.indexOf(review))}
                                className="group bg-white rounded-3xl p-6 border border-gray-100 hover:border-primary-200 hover:shadow-xl transition-all cursor-pointer"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-gray-100 group-hover:border-primary-200 transition-all shrink-0">
                                        <img
                                            src={review.image}
                                            alt={review.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-black text-gray-900">{review.name}</h4>
                                                    {review.verified && (
                                                        <div className="w-4 h-4 bg-primary-100 rounded-full flex items-center justify-center">
                                                            <svg className="w-2.5 h-2.5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="text-xs text-gray-400 font-medium">{review.location}</div>
                                            </div>
                                            <div className="flex gap-0.5">
                                                {[...Array(review.rating)].map((_, i) => (
                                                    <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600 font-medium line-clamp-2 mb-3">
                                            {review.review}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-400 font-medium">{review.date}</span>
                                            <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                                                <ThumbsUp size={12} />
                                                {review.helpful} مفيد
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Review Indicators */}
                <div className="flex justify-center gap-2">
                    {reviews.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveReview(index)}
                            className={`h-2 rounded-full transition-all ${index === activeReview
                                    ? 'w-12 bg-primary-500'
                                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                                }`}
                        />
                    ))}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mt-16"
                >
                    <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                        <div className="flex-1 text-right">
                            <h3 className="text-2xl font-black text-gray-900 mb-2">انضم لآلاف العملاء السعداء</h3>
                            <p className="text-gray-500 font-medium">احجز رحلتك القادمة معنا وشارك تجربتك</p>
                        </div>
                        <a
                            href="/hotels"
                            className="h-14 px-8 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-2xl font-black flex items-center gap-2 shadow-lg shadow-primary-500/30 transition-all whitespace-nowrap"
                        >
                            <Sparkles size={20} />
                            ابدأ الحجز الآن
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
