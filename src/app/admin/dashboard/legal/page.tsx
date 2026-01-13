'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldAlert,
    FileText,
    ExternalLink,
    CheckCircle2,
    Clock,
    Lock,
    Scale,
    Gavel,
    Edit3,
    X,
    Save,
    Loader2,
    AlertTriangle,
    RefreshCw,
    Download
} from 'lucide-react';

interface Policy {
    id: string;
    name: string;
    lastUpdated: string;
    content: string;
}

interface License {
    name: string;
    status: 'ساري' | 'ينتهي قريباً' | 'منتهي';
    expiry: string;
}

export default function LegalManagement() {
    const [policies, setPolicies] = useState<Policy[]>([
        {
            id: '1',
            name: 'سياسة الخصوصية',
            lastUpdated: 'منذ شهر',
            content: 'نحن في ضيافة خلود نلتزم بحماية خصوصية عملائنا الكرام. تشرح هذه السياسة كيفية جمع واستخدام ومشاركة معلوماتك الشخصية.\n\n1. جمع المعلومات:\nنقوم بجمع المعلومات التي تقدمها لنا مباشرة، مثل الاسم والبريد الإلكتروني ورقم الهاتف وتفاصيل الدفع.\n\n2. استخدام المعلومات:\nنستخدم معلوماتك لمعالجة الحجوزات وتقديم خدمة العملاء وإرسال التحديثات.\n\n3. حماية البيانات:\nنستخدم تقنيات التشفير المتقدمة لحماية بياناتك.'
        },
        {
            id: '2',
            name: 'شروط الاستخدام',
            lastUpdated: 'منذ 3 أشهر',
            content: 'باستخدامك لموقع ضيافة خلود، فإنك توافق على الالتزام بهذه الشروط والأحكام.\n\n1. أهلية الاستخدام:\nيجب أن يكون عمرك 18 عامًا أو أكثر لاستخدام خدماتنا.\n\n2. الحجوزات:\nجميع الحجوزات خاضعة للتوفر وسياسات الإلغاء الخاصة بكل فندق.\n\n3. المسؤولية:\nنحن لسنا مسؤولين عن أي أضرار ناتجة عن استخدام خدماتنا.'
        },
        {
            id: '3',
            name: 'سياسة الإلغاء والاسترجاع',
            lastUpdated: 'منذ أسبوعين',
            content: 'نسعى جاهدين لتوفير سياسة إلغاء مرنة لعملائنا.\n\n1. الإلغاء المجاني:\n- يمكن الإلغاء مجانًا قبل 48 ساعة من موعد الوصول.\n- بعد ذلك، يتم خصم ليلة واحدة.\n\n2. الاسترداد:\n- يتم استرداد المبلغ خلال 7-14 يوم عمل.\n- الاسترداد يكون بنفس طريقة الدفع الأصلية.\n\n3. حالات خاصة:\n- في حالات الطوارئ الطبية، يرجى التواصل معنا للنظر في حالتك.'
        },
    ]);

    const [licenses] = useState<License[]>([
        { name: 'تصريح وزارة الحج والعمرة', status: 'ساري', expiry: '2026-12-30' },
        { name: 'السجل التجاري', status: 'ساري', expiry: '2027-04-12' },
        { name: 'ترخيص السياحة الإلكترونية', status: 'ينتهي قريباً', expiry: '2026-03-01' },
    ]);

    const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null);
    const [editContent, setEditContent] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleEditPolicy = (policy: Policy) => {
        setEditingPolicy(policy);
        setEditContent(policy.content);
    };

    const handleSavePolicy = async () => {
        if (!editingPolicy) return;

        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 1500));

        setPolicies(policies.map(p =>
            p.id === editingPolicy.id
                ? { ...p, content: editContent, lastUpdated: 'الآن' }
                : p
        ));

        setIsSaving(false);
        setEditingPolicy(null);
        alert(`تم تحديث "${editingPolicy.name}" بنجاح!`);
    };

    const handleRenewLicense = (licenseName: string) => {
        alert(`سيتم فتح نموذج تجديد "${licenseName}"\n\nسيتم التواصل مع الجهات المختصة لتجديد الترخيص.`);
    };

    const handleExportPolicy = (policy: Policy) => {
        const blob = new Blob([`${policy.name}\n${'='.repeat(policy.name.length)}\n\n${policy.content}`], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${policy.name.replace(/ /g, '-')}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-10 pb-10 text-right" dir="rtl">
            <div>
                <h1 className="text-3xl font-black text-gray-900 mb-2">المتطلبات القانونية</h1>
                <p className="text-gray-500 font-bold">إدارة تصاريح السجل التجاري، التراخيص الحكومية، وسياسات الخصوصية.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Government Compliance */}
                <div className="bg-[#0F1713] rounded-[3rem] p-10 text-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px]" />
                    <h3 className="text-xl font-black mb-8 flex items-center gap-3 relative z-10">
                        <Scale className="text-primary-500" />
                        الامتثال الحكومي
                    </h3>
                    <div className="space-y-4 relative z-10">
                        {licenses.map((doc, i) => (
                            <div key={i} className="p-6 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between hover:bg-white/10 transition-colors group">
                                <div>
                                    <div className="font-black mb-1">{doc.name}</div>
                                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">تنتهي في {doc.expiry}</div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-4 py-1 rounded-full text-[10px] font-black ${doc.status === 'ساري' ? 'bg-emerald-500/20 text-emerald-400' :
                                            doc.status === 'ينتهي قريباً' ? 'bg-yellow-500/20 text-yellow-400' :
                                                'bg-red-500/20 text-red-400'
                                        }`}>
                                        {doc.status}
                                    </span>
                                    {doc.status !== 'ساري' && (
                                        <button
                                            onClick={() => handleRenewLicense(doc.name)}
                                            className="opacity-0 group-hover:opacity-100 w-8 h-8 bg-white/10 hover:bg-primary-500 hover:text-black rounded-lg flex items-center justify-center transition-all"
                                        >
                                            <RefreshCw size={14} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Warning Alert */}
                    <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex items-start gap-3 relative z-10">
                        <AlertTriangle size={20} className="text-yellow-500 shrink-0 mt-0.5" />
                        <div>
                            <div className="font-black text-yellow-400 text-sm mb-1">تنبيه هام</div>
                            <div className="text-xs text-yellow-200/70">ترخيص السياحة الإلكترونية ينتهي خلال أقل من شهرين. يرجى التجديد قبل انتهاء الصلاحية.</div>
                        </div>
                    </div>
                </div>

                {/* Policy Editor */}
                <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm">
                    <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                        <FileText className="text-primary-500" />
                        محرر السياسات
                    </h3>
                    <div className="space-y-4">
                        {policies.map((p, i) => (
                            <div key={i} className="group p-6 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all flex items-center justify-between">
                                <div>
                                    <div className="font-black text-gray-900">{p.name}</div>
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">تحديث: {p.lastUpdated}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleExportPolicy(p)}
                                        className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-900 hover:shadow-md transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <Download size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleEditPolicy(p)}
                                        className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 hover:bg-primary-500 hover:text-black transition-all shadow-sm"
                                    >
                                        <Edit3 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="mt-6 w-full h-14 border-2 border-dashed border-gray-200 hover:border-primary-500 rounded-2xl font-black text-sm text-gray-400 hover:text-primary-600 transition-all flex items-center justify-center gap-2">
                        <FileText size={18} />
                        إضافة سياسة جديدة
                    </button>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm">
                <h3 className="text-xl font-black text-gray-900 mb-6">إجراءات سريعة</h3>
                <div className="flex flex-wrap gap-4">
                    <button className="h-14 px-6 bg-gray-50 hover:bg-gray-100 rounded-xl font-bold text-sm text-gray-600 transition-colors flex items-center gap-2">
                        <Gavel size={18} />
                        طلب استشارة قانونية
                    </button>
                    <button className="h-14 px-6 bg-gray-50 hover:bg-gray-100 rounded-xl font-bold text-sm text-gray-600 transition-colors flex items-center gap-2">
                        <Download size={18} />
                        تحميل جميع السياسات
                    </button>
                    <button className="h-14 px-6 bg-gray-50 hover:bg-gray-100 rounded-xl font-bold text-sm text-gray-600 transition-colors flex items-center gap-2">
                        <ExternalLink size={18} />
                        عرض على الموقع
                    </button>
                </div>
            </div>

            {/* Edit Policy Modal */}
            <AnimatePresence>
                {editingPolicy && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setEditingPolicy(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-white rounded-[2rem] p-8 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-xl font-black text-gray-900">تعديل {editingPolicy.name}</h3>
                                    <p className="text-sm text-gray-400 font-bold mt-1">آخر تحديث: {editingPolicy.lastUpdated}</p>
                                </div>
                                <button
                                    onClick={() => setEditingPolicy(null)}
                                    className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-auto">
                                <textarea
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    className="w-full h-[400px] p-6 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-primary-500/30 outline-none font-medium text-gray-700 resize-none leading-relaxed"
                                    dir="rtl"
                                />
                            </div>

                            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-100">
                                <button
                                    onClick={() => setEditingPolicy(null)}
                                    className="flex-1 h-14 bg-gray-100 text-gray-600 rounded-xl font-black hover:bg-gray-200 transition-colors"
                                >
                                    إلغاء
                                </button>
                                <button
                                    onClick={handleSavePolicy}
                                    disabled={isSaving}
                                    className="flex-1 h-14 bg-black text-white rounded-xl font-black hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            جاري الحفظ...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={18} />
                                            حفظ التغييرات
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
