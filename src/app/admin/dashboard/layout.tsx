'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    CalendarCheck,
    Palmtree,
    Users,
    Settings,
    Bell,
    Search,
    LogOut,
    ChevronDown,
    Menu,
    X,
    FileText,
    TrendingUp,
    ShieldCheck,
    Moon,
    Sun
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/components/ThemeProvider';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname();
    const { isDarkMode, toggleDarkMode } = useTheme();

    // Auto-close sidebar on mobile when route changes
    React.useEffect(() => {
        if (window.innerWidth < 768) {
            setIsSidebarOpen(false);
        }
    }, [pathname]);

    // Initial state based on screen size
    React.useEffect(() => {
        if (window.innerWidth >= 1024) {
            setIsSidebarOpen(true);
        }
    }, []);

    const menuItems = [
        { name: 'الاستعراض العام', icon: LayoutDashboard, href: '/admin/dashboard' },
        { name: 'إدارة الحجوزات', icon: CalendarCheck, href: '/admin/dashboard/bookings' },
        { name: 'الفنادق والبرامج', icon: Palmtree, href: '/admin/dashboard/hotels' },
        { name: 'قاعدة العملاء', icon: Users, href: '/admin/dashboard/customers' },
        { name: 'التقارير المالية', icon: TrendingUp, href: '/admin/dashboard/reports' },
        { name: 'المتطلبات القانونية', icon: FileText, href: '/admin/dashboard/legal' },
        { name: 'الإعدادات', icon: Settings, href: '/admin/dashboard/settings' },
    ];

    return (
        <div className={`min-h-screen flex relative transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-[#F8FAFB]'}`} dir="rtl">
            {/* Mobile Backdrop */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{
                    width: isSidebarOpen ? 280 : (typeof window !== 'undefined' && window.innerWidth < 768 ? 0 : 80),
                    x: isSidebarOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 768 ? 280 : 0)
                }}
                className={`fixed lg:relative z-50 h-[100dvh] bg-[#0F1713] text-white border-l border-white/5 flex flex-col shadow-2xl transition-all duration-300 ${isSidebarOpen ? 'translate-x-0' : 'lg:translate-x-0'}`}
            >
                {/* Sidebar Header */}
                <div className="h-20 lg:h-24 flex items-center px-6 gap-4 border-b border-white/5 overflow-hidden whitespace-nowrap shrink-0">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-primary-500 rounded-2xl flex items-center justify-center text-xl lg:text-2xl shrink-0">🕋</div>
                    {isSidebarOpen && (
                        <div className="flex flex-col">
                            <span className="font-black text-lg lg:text-xl">ضيافة خلود</span>
                            <span className="text-[10px] text-primary-500/80 font-bold uppercase tracking-widest">Command Center</span>
                        </div>
                    )}
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 py-6 lg:py-10 px-4 space-y-1 lg:space-y-2 overflow-y-auto custom-scrollbar">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.name} href={item.href}>
                                <motion.div
                                    whileHover={{ x: -4 }}
                                    className={`flex items-center gap-4 px-4 py-3 lg:py-3.5 rounded-2xl transition-all group overflow-hidden relative ${isActive
                                        ? 'bg-primary-500 text-black font-black'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <item.icon size={20} className={isActive ? 'text-black' : 'group-hover:scale-110 transition-transform'} />
                                    {isSidebarOpen && <span className="text-sm">{item.name}</span>}
                                    {isActive && isSidebarOpen && (
                                        <motion.div layoutId="active" className="absolute right-0 w-1.5 h-6 bg-white rounded-l-full" />
                                    )}
                                </motion.div>
                            </Link>
                        );
                    })}
                </nav>

                {/* Sidebar Footer */}
                <div className="p-4 mt-auto border-t border-white/5 shrink-0">
                    <button className="flex items-center gap-4 w-full px-4 py-3 lg:py-3.5 text-red-400 hover:bg-red-400/10 rounded-2xl transition-colors">
                        <LogOut size={20} />
                        {isSidebarOpen && <span className="font-black text-sm">تسجيل الخروج</span>}
                    </button>
                    {isSidebarOpen && (
                        <div className="mt-4 px-4 pb-2 hidden lg:block">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center border border-white/10">
                                    <ShieldCheck size={20} className="text-primary-500" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </motion.aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 h-[100dvh] overflow-hidden">
                {/* Top Header */}
                <header className={`h-20 lg:h-24 border-b px-4 lg:px-8 flex items-center justify-between z-40 shrink-0 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800/80 backdrop-blur-md border-gray-700' : 'bg-white/80 backdrop-blur-md border-gray-100'}`}>
                    <div className="flex items-center gap-3 lg:gap-6 flex-1">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className={`w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-2xl transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-50 text-gray-500'}`}
                        >
                            <Menu size={24} className={isSidebarOpen && (typeof window !== 'undefined' && window.innerWidth < 1024) ? "rotate-90 text-primary-600" : ""} />
                        </button>

                        <div className="relative max-w-md w-full hidden md:block">
                            <div className={`absolute right-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                <Search size={20} />
                            </div>
                            <input
                                type="text"
                                placeholder="ابحث..."
                                className={`w-full h-12 lg:h-14 pr-12 pl-6 rounded-2xl outline-none font-medium transition-all text-sm ${isDarkMode ? 'bg-gray-700/50 border border-gray-600 text-white placeholder-gray-500 focus:bg-gray-700 focus:border-primary-500/30' : 'bg-gray-50/50 border border-gray-100 focus:bg-white focus:border-primary-500/30'}`}
                            />
                        </div>

                        {/* Mobile Logo if sidebar hidden */}
                        {!isSidebarOpen && (
                            <div className="lg:hidden flex items-center gap-2">
                                <span className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-sm">🕋</span>
                                <span className={`font-black text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>ضيافة خلود</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2 lg:gap-4">
                        {/* Dark Mode Toggle */}
                        <button
                            onClick={toggleDarkMode}
                            className={`w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-2xl transition-colors ${isDarkMode ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        <div className={`hidden sm:flex items-center gap-2 px-3 lg:px-4 py-1.5 lg:py-2 rounded-full border font-black text-[10px] lg:text-xs ${isDarkMode ? 'bg-emerald-900/50 text-emerald-400 border-emerald-800' : 'bg-emerald-50 text-emerald-700 border-emerald-100'}`}>
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            <span>النظام يعمل</span>
                        </div>

                        <div className="flex items-center gap-1 lg:gap-2">
                            <button className={`w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-2xl relative ${isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-50'}`}>
                                <Bell size={20} />
                                <span className={`absolute top-2.5 right-2.5 lg:top-3 lg:left-3 w-2 h-2 bg-primary-500 rounded-full border-2 ${isDarkMode ? 'border-gray-800' : 'border-white'}`} />
                            </button>
                            <div className={`hidden lg:block w-px h-8 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} mx-2`} />
                            <button className={`flex items-center gap-2 lg:gap-3 pl-1 pr-1 lg:pl-2 lg:pr-4 py-1 lg:py-2 rounded-2xl transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                                <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-xl flex items-center justify-center font-black text-sm ${isDarkMode ? 'bg-primary-900/50 text-primary-400' : 'bg-primary-100 text-primary-700'}`}>M</div>
                                <ChevronDown size={14} className={`hidden sm:block ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Main Scrollable Content */}
                <main className={`flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-[#F8FAFB]'}`}>
                    {children}
                </main>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: ${isDarkMode ? '#374151' : '#E2E8F0'}; border-radius: 10px; }
                .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: ${isDarkMode ? '#4B5563' : '#CBD5E0'}; }
            `}</style>
        </div>
    );
}
