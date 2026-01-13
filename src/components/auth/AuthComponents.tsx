'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, Phone, ArrowRight, User } from 'lucide-react';

export function AuthCard({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle?: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-[480px] bg-white/70 backdrop-blur-2xl p-8 md:p-12 rounded-[3.5rem] border border-white/50 shadow-[0_50px_100px_rgba(0,0,0,0.08)] relative overflow-hidden"
        >
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary-500/5 rounded-full blur-[60px]" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-500/5 rounded-full blur-[60px]" />

            <div className="relative z-10">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black text-gray-900 mb-3">{title}</h1>
                    {subtitle && <p className="text-gray-500 font-medium">{subtitle}</p>}
                </div>
                {children}
            </div>
        </motion.div>
    );
}

export function AuthInput({ label, type = "text", placeholder, icon: Icon }: { label: string; type?: string; placeholder: string; icon: any }) {
    const [showPassword, setShowPassword] = React.useState(false);
    const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type;

    return (
        <div className="space-y-3 mb-6">
            <label className="text-sm font-black text-gray-700 mr-1 block">{label}</label>
            <div className="relative group">
                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 transition-colors">
                    <Icon size={20} />
                </div>
                <input
                    type={inputType}
                    placeholder={placeholder}
                    className="w-full h-16 pr-14 pl-6 bg-gray-50 rounded-2xl border-2 border-transparent focus:bg-white focus:border-primary-500 transition-all outline-none font-bold text-gray-900 placeholder:text-gray-400"
                />
                {type === 'password' && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                )}
            </div>
        </div>
    );
}

export function AuthSubmit({ label, icon: Icon = ArrowRight }: { label: string; icon?: any }) {
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full h-[76px] bg-primary-600 hover:bg-primary-700 text-white font-black rounded-2xl shadow-2xl shadow-primary-600/20 transition-all flex items-center justify-center gap-4 group mt-8"
        >
            <span className="text-lg">{label}</span>
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:translate-x-[-4px] transition-transform">
                <Icon size={20} />
            </div>
        </motion.button>
    );
}

export function SocialAuth() {
    return (
        <div className="mt-10">
            <div className="relative flex items-center justify-center mb-8">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-100"></div>
                </div>
                <span className="relative z-10 px-4 bg-transparent text-gray-400 text-xs font-bold uppercase tracking-widest">أو عبر</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <SocialButton src="https://www.svgrepo.com/show/475656/google-color.svg" label="جوجل" />
                <SocialButton src="https://www.svgrepo.com/show/442939/apple.svg" label="آبل" />
            </div>
        </div>
    );
}

function SocialButton({ src, label }: { src: string; label: string }) {
    return (
        <button className="h-16 flex items-center justify-center gap-3 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all shadow-sm hover:shadow-md">
            <img src={src} alt={label} className="w-6 h-6" />
            <span className="font-bold text-gray-700">{label}</span>
        </button>
    );
}
