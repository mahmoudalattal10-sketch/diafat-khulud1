'use client';

import { motion } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const destinations = [
    {
        id: 'makkah',
        title: 'مكة المكرمة',
        subtitle: 'بيت الله الحرام',
        description: 'اكتشف فنادق مكة القريبة من الحرم المكي الشريف',
        image: '/images/makkah.png',
        color: 'from-secondary-900/80 to-secondary-900/40',
    },
    {
        id: 'madinah',
        title: 'المدينة المنورة',
        subtitle: 'مدينة الرسول ﷺ',
        description: 'إقامة مميزة بجوار المسجد النبوي الشريف',
        image: '/images/madinah.png',
        color: 'from-secondary-800/80 to-secondary-800/40',
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 12
        }
    }
};

export default function DestinationsSection() {
    return (
        <section className="py-12 md:py-20 bg-gray-50 overflow-hidden relative z-20">
            <div className="container-custom">
                {/* Section Header */}
                <div className="text-center mb-10 md:mb-16 max-w-2xl mx-auto px-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4"
                    >
                        وجهاتنا المباركة
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-500 text-lg"
                    >
                        اختر وجهتك المفضلة واستمتع بإقامة روحانية مريحة
                    </motion.p>
                </div>

                {/* Cards Grid / Scroll */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="flex md:flex-row md:justify-center gap-4 md:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-8 md:pb-0 px-4 md:px-0 -mx-4 md:mx-0 hide-scrollbar max-w-6xl mx-auto"
                >
                    {destinations.map((dest) => (
                        <motion.div
                            key={dest.id}
                            variants={cardVariants}
                            whileHover={{ y: -10 }}
                            className="group relative flex-none w-[85vw] md:w-[450px] lg:w-[500px] snap-center bg-white rounded-3xl overflow-hidden shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-300 border border-gray-100 h-[400px] md:h-[500px]"
                        >
                            {/* Background Image */}
                            <div className="absolute inset-0">
                                <Image
                                    src={dest.image}
                                    alt={dest.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                {/* Overlay Gradient */}
                                <div className={`absolute inset-0 bg-gradient-to-t ${dest.color} via-black/20 to-transparent opacity-90`} />
                            </div>

                            {/* Content */}
                            <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end text-white text-center">
                                <div className="transform md:translate-y-4 md:group-hover:translate-y-0 transition-transform duration-300 flex flex-col items-center">
                                    <h3 className="text-3xl font-bold mb-2">
                                        {dest.title}
                                    </h3>
                                    <p className="font-medium text-white/90 mb-6 text-lg">
                                        {dest.subtitle}
                                    </p>
                                    <p className="text-gray-200 mb-8 max-w-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 delay-100 hidden md:block leading-relaxed">
                                        {dest.description}
                                    </p>

                                    <Link
                                        href={`/hotels?location=${encodeURIComponent(dest.title)}`}
                                        className="w-full py-4 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold hover:bg-white hover:text-gray-900 transition-all flex items-center justify-center gap-2 group/btn"
                                    >
                                        <span>عرض الفنادق</span>
                                        <ArrowRight size={20} className="transform group-hover/btn:-translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
