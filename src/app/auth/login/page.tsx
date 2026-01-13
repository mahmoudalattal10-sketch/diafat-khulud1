'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    User,
    Phone,
    ArrowRight,
    Check,
    Shield,
    Sparkles,
    Heart,
    Star,
    MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type AuthMode = 'login' | 'signup';

export default function AuthPage() {
    const router = useRouter();
    const [mode, setMode] = useState<AuthMode>('login');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    const [signupData, setSignupData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const result = await signIn('credentials', {
                email: loginData.email,
                password: loginData.password,
                redirect: false,
            });

            if (result?.error) {
                setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
                setIsLoading(false);
            } else {
                // Fetch session to determine role
                const sessionRes = await fetch('/api/auth/session');
                const session = await sessionRes.json();

                if (session?.user?.role === 'ADMIN') {
                    router.push('/admin/dashboard');
                } else {
                    router.push('/user/dashboard');
                }
                router.refresh();
            }
        } catch (err) {
            setError('حدث خطأ غير متوقع');
            setIsLoading(false);
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Validation
        if (signupData.password !== signupData.confirmPassword) {
            setError('كلمات المرور غير متطابقة');
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: signupData.name,
                    email: signupData.email,
                    phone: signupData.phone,
                    password: signupData.password,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'فشل إنشاء الحساب');
                setIsLoading(false);
                return;
            }

            // Auto login after signup
            await signIn('credentials', {
                email: signupData.email,
                password: signupData.password,
                redirect: false,
            });

            router.push('/user/dashboard');
            router.refresh();

        } catch (err) {
            setError('حدث خطأ أثناء الاتصال بالخادم');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/30 flex items-center justify-center p-6">
            <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
                {/* Left Side - Branding */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="hidden lg:block"
                >
                    <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-[3rem] p-12 text-white shadow-2xl shadow-primary-500/20 relative overflow-hidden">
                        {/* Decorative Elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl" />

                        <div className="relative z-10">
                            <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-3xl flex items-center justify-center mb-8">
                                <Shield size={40} />
                            </div>

                            <h1 className="text-4xl font-black mb-4">مرحباً بك في</h1>
                            <h2 className="text-5xl font-black mb-6 bg-gradient-to-r from-white to-white/80 bg-clip-text">
                                ضيافة خلود
                            </h2>
                            <p className="text-xl text-white/90 font-medium leading-relaxed mb-12">
                                اكتشف أفضل الفنادق والمنتجعات في المملكة العربية السعودية
                            </p>

                            <div className="space-y-6">
                                {[
                                    { icon: Check, text: 'أكثر من 500+ فندق فاخر' },
                                    { icon: Star, text: 'أفضل الأسعار المضمونة' },
                                    { icon: Shield, text: 'حجز آمن ومضمون' },
                                    { icon: Heart, text: 'دعم عملاء على مدار الساعة' }
                                ].map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex items-center gap-4"
                                    >
                                        <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center shrink-0">
                                            <item.icon size={24} />
                                        </div>
                                        <span className="font-bold text-lg">{item.text}</span>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-white/20">
                                <div>
                                    <div className="text-3xl font-black mb-1">500+</div>
                                    <div className="text-white/80 text-sm font-medium">فندق</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-black mb-1">50K+</div>
                                    <div className="text-white/80 text-sm font-medium">عميل</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-black mb-1">4.9</div>
                                    <div className="text-white/80 text-sm font-medium">تقييم</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Right Side - Auth Form */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl border border-gray-100"
                >
                    {/* Back to Home */}
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-600 font-bold text-sm mb-8 transition-all"
                    >
                        <ArrowRight size={16} />
                        العودة للرئيسية
                    </Link>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-8 bg-gray-50 p-2 rounded-2xl">
                        <button
                            onClick={() => setMode('login')}
                            className={`flex-1 h-12 rounded-xl font-black text-sm transition-all relative ${mode === 'login'
                                ? 'bg-white text-gray-900 shadow-lg'
                                : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            تسجيل الدخول
                            {mode === 'login' && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-white rounded-xl shadow-lg -z-10"
                                />
                            )}
                        </button>
                        <button
                            onClick={() => setMode('signup')}
                            className={`flex-1 h-12 rounded-xl font-black text-sm transition-all relative ${mode === 'signup'
                                ? 'bg-white text-gray-900 shadow-lg'
                                : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            إنشاء حساب
                            {mode === 'signup' && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-white rounded-xl shadow-lg -z-10"
                                />
                            )}
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        {/* Login Form */}
                        {mode === 'login' && (
                            <motion.form
                                key="login"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                onSubmit={handleLogin}
                                className="space-y-6"
                            >
                                <div>
                                    <h2 className="text-3xl font-black text-gray-900 mb-2">أهلاً بعودتك! 👋</h2>
                                    <p className="text-gray-400 font-medium">سجل دخولك لمتابعة حجوزاتك</p>
                                </div>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3 text-red-600"
                                    >
                                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                                            <span className="text-lg">⚠️</span>
                                        </div>
                                        <span className="font-bold text-sm">{error}</span>
                                    </motion.div>
                                )}

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 block">
                                            البريد الإلكتروني
                                        </label>
                                        <div className="relative">
                                            <Mail size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="email"
                                                value={loginData.email}
                                                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                                placeholder="example@email.com"
                                                className="w-full h-14 pr-12 pl-4 bg-gray-50 rounded-xl border-2 border-transparent focus:bg-white focus:border-primary-500 font-bold text-gray-900 outline-none transition-all"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 block">
                                            كلمة المرور
                                        </label>
                                        <div className="relative">
                                            <Lock size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={loginData.password}
                                                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                                placeholder="••••••••"
                                                className="w-full h-14 pr-12 pl-12 bg-gray-50 rounded-xl border-2 border-transparent focus:bg-white focus:border-primary-500 font-bold text-gray-900 outline-none transition-all"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                                        <span className="font-bold text-gray-600">تذكرني</span>
                                    </label>
                                    <button type="button" className="font-bold text-primary-500 hover:text-primary-600">
                                        نسيت كلمة المرور؟
                                    </button>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-14 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl font-black shadow-lg shadow-primary-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            جاري تسجيل الدخول...
                                        </div>
                                    ) : (
                                        'تسجيل الدخول'
                                    )}
                                </button>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-200" />
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-4 bg-white text-gray-400 font-bold">أو</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        className="h-12 bg-gray-50 hover:bg-gray-100 rounded-xl font-bold text-gray-600 transition-all flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                        Google
                                    </button>
                                    <button
                                        type="button"
                                        className="h-12 bg-gray-50 hover:bg-gray-100 rounded-xl font-bold text-gray-600 transition-all flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                        </svg>
                                        Facebook
                                    </button>
                                </div>
                            </motion.form>
                        )}

                        {/* Signup Form */}
                        {mode === 'signup' && (
                            <motion.form
                                key="signup"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                onSubmit={handleSignup}
                                className="space-y-6"
                            >
                                <div>
                                    <h2 className="text-3xl font-black text-gray-900 mb-2">انضم إلينا! ✨</h2>
                                    <p className="text-gray-400 font-medium">أنشئ حساب جديد واحجز رحلتك</p>
                                </div>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3 text-red-600"
                                    >
                                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                                            <span className="text-lg">⚠️</span>
                                        </div>
                                        <span className="font-bold text-sm">{error}</span>
                                    </motion.div>
                                )}

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 block">
                                            الاسم الكامل
                                        </label>
                                        <div className="relative">
                                            <User size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                value={signupData.name}
                                                onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                                                placeholder="أحمد محمد"
                                                className="w-full h-14 pr-12 pl-4 bg-gray-50 rounded-xl border-2 border-transparent focus:bg-white focus:border-primary-500 font-bold text-gray-900 outline-none transition-all"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 block">
                                            البريد الإلكتروني
                                        </label>
                                        <div className="relative">
                                            <Mail size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="email"
                                                value={signupData.email}
                                                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                                                placeholder="example@email.com"
                                                className="w-full h-14 pr-12 pl-4 bg-gray-50 rounded-xl border-2 border-transparent focus:bg-white focus:border-primary-500 font-bold text-gray-900 outline-none transition-all"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 block">
                                            رقم الجوال
                                        </label>
                                        <div className="relative">
                                            <Phone size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="tel"
                                                value={signupData.phone}
                                                onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                                                placeholder="+966 50 123 4567"
                                                className="w-full h-14 pr-12 pl-4 bg-gray-50 rounded-xl border-2 border-transparent focus:bg-white focus:border-primary-500 font-bold text-gray-900 outline-none transition-all"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 block">
                                            كلمة المرور
                                        </label>
                                        <div className="relative">
                                            <Lock size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={signupData.password}
                                                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                                                placeholder="••••••••"
                                                className="w-full h-14 pr-12 pl-12 bg-gray-50 rounded-xl border-2 border-transparent focus:bg-white focus:border-primary-500 font-bold text-gray-900 outline-none transition-all"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 block">
                                            تأكيد كلمة المرور
                                        </label>
                                        <div className="relative">
                                            <Lock size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={signupData.confirmPassword}
                                                onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                                                placeholder="••••••••"
                                                className="w-full h-14 pr-12 pl-4 bg-gray-50 rounded-xl border-2 border-transparent focus:bg-white focus:border-primary-500 font-bold text-gray-900 outline-none transition-all"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input type="checkbox" className="mt-1 w-4 h-4 rounded border-gray-300" required />
                                    <span className="text-sm font-medium text-gray-600">
                                        أوافق على <button type="button" className="text-primary-500 hover:text-primary-600 font-bold">الشروط والأحكام</button> و <button type="button" className="text-primary-500 hover:text-primary-600 font-bold">سياسة الخصوصية</button>
                                    </span>
                                </label>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-14 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl font-black shadow-lg shadow-primary-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            جاري إنشاء الحساب...
                                        </div>
                                    ) : (
                                        'إنشاء حساب'
                                    )}
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
}
