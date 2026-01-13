'use client';

import { motion } from 'framer-motion';
import { Star, MapPin, Clock, Users, ArrowLeft } from 'lucide-react';
import Image from 'next/image';

const packages = [
    {
        id: 1,
        title: 'عمرة اقتصادية',
        location: 'مكة المكرمة',
        duration: '7 أيام',
        persons: '2-4 أشخاص',
        price: 'SAR 3,500',
        originalPrice: 'SAR 4,200',
        rating: 4.8,
        reviews: 245,
        image: 'https://images.unsplash.com/photo-1565019001729-f2c07d4a1a10?q=80&w=2070&auto=format&fit=crop',
        features: ['فندق 3 نجوم', 'مواصلات', 'إفطار'],
        badge: 'الأكثر طلباً',
        badgeColor: 'bg-primary-500',
    },
    {
        id: 2,
        title: 'عمرة VIP',
        location: 'مكة والمدينة',
        duration: '10 أيام',
        persons: '2-6 أشخاص',
        price: 'SAR 8,500',
        originalPrice: 'SAR 10,000',
        rating: 4.9,
        reviews: 189,
        image: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?q=80&w=2070&auto=format&fit=crop',
        features: ['فندق 5 نجوم', 'مواصلات خاصة', 'وجبات كاملة'],
        badge: 'مميز',
        badgeColor: 'bg-primary-500',
    },
    {
        id: 3,
        title: 'عمرة عائلية',
        location: 'مكة والمدينة',
        duration: '14 يوم',
        persons: 'حتى 8 أشخاص',
        price: 'SAR 12,000',
        originalPrice: 'SAR 15,000',
        rating: 5.0,
        reviews: 98,
        image: 'https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?q=80&w=2070&auto=format&fit=crop',
        features: ['فندق 4 نجوم', 'جناح عائلي', 'مرشد خاص'],
        badge: 'للعائلات',
        badgeColor: 'bg-emerald-500',
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 },
    },
};

export default function PopularPackages() {
    return (
        <section id="packages" className="section-padding bg-gray-50">
            <div className="container-custom">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <span className="inline-block text-primary-500 font-semibold text-sm mb-2 bg-primary-50 px-4 py-1 rounded-full">
                        باقاتنا المميزة
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        أشهر باقات العمرة
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        اختر من بين مجموعة متنوعة من الباقات المصممة خصيصاً لتناسب احتياجاتك وميزانيتك
                    </p>
                </motion.div>

                {/* Packages Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {packages.map((pkg) => (
                        <motion.div
                            key={pkg.id}
                            variants={cardVariants}
                            className="group bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"
                        >
                            {/* Image */}
                            <div className="relative h-56 overflow-hidden">
                                <Image
                                    src={pkg.image}
                                    alt={pkg.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                {/* Badge */}
                                <span className={`absolute top-4 right-4 ${pkg.badgeColor} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
                                    {pkg.badge}
                                </span>
                                {/* Discount */}
                                <div className="absolute bottom-4 left-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                                    خصم {Math.round((1 - parseInt(pkg.price.replace(/[^0-9]/g, '')) / parseInt(pkg.originalPrice.replace(/[^0-9]/g, ''))) * 100)}%
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                {/* Rating */}
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="flex items-center gap-1 text-primary-500">
                                        <Star size={16} fill="currentColor" />
                                        <span className="font-bold text-gray-900">{pkg.rating}</span>
                                    </div>
                                    <span className="text-gray-500 text-sm">({pkg.reviews} تقييم)</span>
                                </div>

                                {/* Title */}
                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-500 transition-colors">
                                    {pkg.title}
                                </h3>

                                {/* Location */}
                                <div className="flex items-center gap-1 text-gray-500 text-sm mb-4">
                                    <MapPin size={14} className="text-primary-500" />
                                    <span>{pkg.location}</span>
                                </div>

                                {/* Features */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {pkg.features.map((feature, index) => (
                                        <span
                                            key={index}
                                            className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full"
                                        >
                                            {feature}
                                        </span>
                                    ))}
                                </div>

                                {/* Details */}
                                <div className="flex items-center justify-between text-sm text-gray-500 mb-4 pb-4 border-b border-gray-100">
                                    <div className="flex items-center gap-1">
                                        <Clock size={14} />
                                        <span>{pkg.duration}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Users size={14} />
                                        <span>{pkg.persons}</span>
                                    </div>
                                </div>

                                {/* Price & CTA */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-gray-400 text-sm line-through">{pkg.originalPrice}</span>
                                        <div className="text-2xl font-bold text-primary-500">{pkg.price}</div>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex items-center gap-2 bg-primary-500 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-primary-600 transition-colors"
                                    >
                                        <span>احجز</span>
                                        <ArrowLeft size={16} />
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* View All Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="text-center mt-12"
                >
                    <motion.a
                        href="#"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="inline-flex items-center gap-2 border-2 border-primary-500 text-primary-500 px-8 py-3 rounded-xl font-semibold hover:bg-primary-500 hover:text-white transition-all duration-300"
                    >
                        <span>عرض جميع الباقات</span>
                        <ArrowLeft size={18} />
                    </motion.a>
                </motion.div>
            </div>
        </section>
    );
}
