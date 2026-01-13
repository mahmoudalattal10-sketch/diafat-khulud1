'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    const navLinks = [
        { name: 'الرئيسية', href: '/' },
        { name: 'من نحن', href: '/about' },
        { name: 'الفنادق', href: '/hotels' },
        { name: 'تواصل معنا', href: '/contact' },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500`}
            >
                {/* Main Header Container */}
                <div className={`transition-all duration-500 ${isScrolled
                    ? 'bg-white shadow-xl shadow-black/5'
                    : 'bg-white/95 backdrop-blur-sm'
                    }`}>
                    <div className="container-custom">
                        <div className="flex items-center justify-between h-24">

                            {/* Logo - LARGER */}
                            <Link href="/" className="flex items-center group">
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="relative"
                                >
                                    <Image
                                        src="/logo.png"
                                        alt="ضيافة خلود"
                                        width={200}
                                        height={80}
                                        className="h-20 w-auto object-contain"
                                        priority
                                    />
                                    {/* Subtle Glow Effect */}
                                    <div className="absolute -inset-2 bg-gradient-to-r from-primary-500/10 to-primary-400/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                </motion.div>
                            </Link>

                            {/* Center Navigation - Modern Creative Style */}
                            <nav className="hidden lg:flex items-center">
                                <div className="flex items-center bg-gray-50 rounded-2xl p-1.5 border border-gray-100">
                                    {navLinks.map((link, index) => {
                                        const isActive = pathname === link.href;
                                        return (
                                            <Link
                                                key={link.name}
                                                href={link.href}
                                                className={`relative px-8 py-3 font-semibold text-sm rounded-xl transition-all duration-300 ${isActive
                                                    ? 'text-white'
                                                    : 'text-gray-600 hover:text-primary-600'
                                                    }`}
                                            >
                                                {/* Active Background */}
                                                {isActive && (
                                                    <motion.div
                                                        layoutId="activeNav"
                                                        className="absolute inset-0 bg-gradient-to-l from-primary-500 to-primary-600 rounded-xl shadow-lg shadow-primary-500/30"
                                                        transition={{ type: "spring", duration: 0.5 }}
                                                    />
                                                )}
                                                <span className="relative z-10">{link.name}</span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </nav>

                            {/* Right Side - Login Button */}
                            <div className="hidden lg:flex items-center gap-4">
                                {/* Language Selector (Optional) */}
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-1 text-gray-500 hover:text-gray-700 font-medium text-sm"
                                >
                                    <span>العربية</span>
                                    <ChevronDown size={14} />
                                </motion.button>

                                {/* Divider */}
                                <div className="w-px h-8 bg-gray-200" />

                                {/* Login Button - Premium Style */}
                                <Link
                                    href="/auth/login"
                                    className="group relative flex items-center gap-3 px-7 py-3.5 rounded-2xl font-semibold text-sm overflow-hidden"
                                >
                                    {/* Gradient Background */}
                                    <div className="absolute inset-0 bg-gradient-to-l from-primary-400 via-primary-500 to-primary-600 rounded-2xl" />

                                    {/* Shine Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                                    {/* Glow */}
                                    <div className="absolute -inset-1 bg-primary-400/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    {/* Content */}
                                    <User size={18} className="relative z-10 text-white" />
                                    <span className="relative z-10 text-white">تسجيل الدخول</span>
                                </Link>
                            </div>

                            {/* Mobile Menu Button */}
                            <motion.button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="lg:hidden w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-2xl flex items-center justify-center transition-colors"
                                whileTap={{ scale: 0.9 }}
                                aria-label="Toggle menu"
                            >
                                <AnimatePresence mode="wait">
                                    {isMobileMenuOpen ? (
                                        <motion.div
                                            key="close"
                                            initial={{ rotate: -90, opacity: 0 }}
                                            animate={{ rotate: 0, opacity: 1 }}
                                            exit={{ rotate: 90, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <X size={22} className="text-gray-700" />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="menu"
                                            initial={{ rotate: 90, opacity: 0 }}
                                            animate={{ rotate: 0, opacity: 1 }}
                                            exit={{ rotate: -90, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Menu size={22} className="text-gray-700" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.button>
                        </div>
                    </div>

                    {/* Bottom Gradient Line */}
                    <div className={`h-0.5 bg-gradient-to-r from-transparent via-primary-500/50 to-transparent transition-opacity duration-300 ${isScrolled ? 'opacity-100' : 'opacity-0'
                        }`} />
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-2xl border-t border-gray-100"
                        >
                            <div className="container-custom py-6">
                                <nav className="flex flex-col gap-2 mb-6">
                                    {navLinks.map((link, index) => {
                                        const isActive = pathname === link.href;
                                        return (
                                            <Link
                                                key={link.name}
                                                href={link.href}
                                                className={`px-5 py-4 font-semibold rounded-2xl transition-all duration-200 ${isActive
                                                    ? 'bg-primary-500 text-white'
                                                    : 'text-gray-700 hover:bg-gray-50'
                                                    }`}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                <motion.div
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                >
                                                    {link.name}
                                                </motion.div>
                                            </Link>
                                        );
                                    })}
                                </nav>

                                {/* Mobile Login Button */}
                                <Link
                                    href="/auth/login"
                                    className="flex items-center justify-center gap-3 w-full bg-gradient-to-l from-primary-400 to-primary-500 text-white px-6 py-4 rounded-2xl font-semibold shadow-lg shadow-primary-500/20"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <User size={20} />
                                    <span>تسجيل الدخول</span>
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.header>
        </>
    );
}
