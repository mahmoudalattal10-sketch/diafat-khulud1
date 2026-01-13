'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Download,
    ArrowUpRight,
    ArrowDownRight,
    TrendingUp,
    DollarSign,
    PieChart,
    Calendar,
    ChevronDown,
    Filter,
    Loader2,
    X,
    FileText,
    Table
} from 'lucide-react';

export default function ReportsManagement() {
    const [selectedPeriod, setSelectedPeriod] = useState('month');
    const [showPeriodSelector, setShowPeriodSelector] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [exportFormat, setExportFormat] = useState<'pdf' | 'excel' | null>(null);

    const periodLabels: Record<string, string> = {
        'week': 'الأسبوع الحالي',
        'month': 'الشهر الحالي',
        'quarter': 'الربع الحالي',
        'year': 'السنة الحالية',
        'custom': 'فترة مخصصة'
    };

    const statsData: Record<string, { profits: string, tax: string, avg: string, profitsChange: string, taxChange: string, avgChange: string }> = {
        'week': { profits: '$18,400', tax: '$2,760', avg: '$1,650', profitsChange: '+8.5%', taxChange: '+1.2%', avgChange: '-0.8%' },
        'month': { profits: '$84,200', tax: '$12,450', avg: '$1,850', profitsChange: '+15.2%', taxChange: '+2.1%', avgChange: '-1.4%' },
        'quarter': { profits: '$245,800', tax: '$36,870', avg: '$1,920', profitsChange: '+22.3%', taxChange: '+3.5%', avgChange: '+2.1%' },
        'year': { profits: '$1,284,500', tax: '$192,675', avg: '$2,100', profitsChange: '+45.8%', taxChange: '+8.2%', avgChange: '+5.6%' },
    };

    const currentStats = statsData[selectedPeriod] || statsData['month'];

    const stats = [
        { label: 'إجمالي الأرباح', value: currentStats.profits, change: currentStats.profitsChange, isUp: currentStats.profitsChange.startsWith('+') },
        { label: 'الضريبة المستحقة', value: currentStats.tax, change: currentStats.taxChange, isUp: currentStats.taxChange.startsWith('+') },
        { label: 'متوسط الفاتورة', value: currentStats.avg, change: currentStats.avgChange, isUp: currentStats.avgChange.startsWith('+') },
    ];

    const revenueBreakdown = [
        { name: 'حجوزات فنادق مكة', percent: 65, color: 'bg-primary-500', amount: '$45,000' },
        { name: 'برامج سياحية', percent: 20, color: 'bg-emerald-500', amount: '$15,500' },
        { name: 'رسوم فيزا ودعم', percent: 15, color: 'bg-blue-500', amount: '$10,200' },
    ];

    const handleExport = async (format: 'pdf' | 'excel') => {
        setExportFormat(format);
        setIsExporting(true);

        await new Promise(resolve => setTimeout(resolve, 2000));

        const reportContent = `
تقرير مالي - ضيافة خلود
========================
الفترة: ${periodLabels[selectedPeriod]}
التاريخ: ${new Date().toLocaleDateString('ar-SA')}

ملخص الأداء:
- إجمالي الأرباح: ${currentStats.profits} (${currentStats.profitsChange})
- الضريبة المستحقة: ${currentStats.tax} (${currentStats.taxChange})
- متوسط الفاتورة: ${currentStats.avg} (${currentStats.avgChange})

توزيع الإيرادات:
${revenueBreakdown.map(item => `- ${item.name}: ${item.amount} (${item.percent}%)`).join('\n')}

=========================
تقرير آلي من نظام ضيافة خلود
        `;

        const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `financial-report-${selectedPeriod}-${Date.now()}.${format === 'pdf' ? 'txt' : 'csv'}`;
        a.click();
        URL.revokeObjectURL(url);

        setIsExporting(false);
        setExportFormat(null);
    };

    return (
        <div className="space-y-10 pb-10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 mb-2">التقارير المالية</h2>
                    <p className="text-gray-500 font-bold">تحليلات الأداء المالي، العوائد، وتقارير الضرائب والمبيعات.</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => handleExport('excel')}
                        disabled={isExporting}
                        className="h-14 px-6 bg-white border border-gray-200 text-gray-700 rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-gray-50 transition-all disabled:opacity-50"
                    >
                        {isExporting && exportFormat === 'excel' ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <Table size={18} />
                        )}
                        <span>تصدير Excel</span>
                    </button>
                    <button
                        onClick={() => handleExport('pdf')}
                        disabled={isExporting}
                        className="h-14 px-8 bg-black text-white rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-gray-800 transition-all disabled:opacity-50"
                    >
                        {isExporting && exportFormat === 'pdf' ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <Download size={18} />
                        )}
                        <span>تصدير تقرير كامل</span>
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-sm font-black text-gray-400 uppercase tracking-widest">{stat.label}</span>
                            <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg ${stat.isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                {stat.isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                {stat.change}
                            </div>
                        </div>
                        <div className="text-3xl font-black text-gray-900">{stat.value}</div>
                    </motion.div>
                ))}
            </div>

            {/* Revenue Breakdown */}
            <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-10">
                    <h3 className="text-xl font-black text-gray-900">سجل الإيرادات التفصيلي</h3>
                    <div className="relative">
                        <button
                            onClick={() => setShowPeriodSelector(!showPeriodSelector)}
                            className="flex items-center gap-2 font-bold text-gray-600 hover:text-gray-900 transition-colors bg-gray-50 px-4 py-2 rounded-xl hover:bg-gray-100"
                        >
                            <Calendar size={16} />
                            <span>{periodLabels[selectedPeriod]}</span>
                            <ChevronDown size={14} className={`transition-transform ${showPeriodSelector ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Period Dropdown */}
                        <AnimatePresence>
                            {showPeriodSelector && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute left-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 min-w-[180px]"
                                >
                                    {Object.entries(periodLabels).filter(([key]) => key !== 'custom').map(([key, label]) => (
                                        <button
                                            key={key}
                                            onClick={() => {
                                                setSelectedPeriod(key);
                                                setShowPeriodSelector(false);
                                            }}
                                            className={`w-full px-4 py-3 text-right text-sm font-bold transition-colors flex items-center justify-between ${selectedPeriod === key ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'}`}
                                        >
                                            {label}
                                            {selectedPeriod === key && <div className="w-2 h-2 rounded-full bg-primary-500" />}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="space-y-6">
                    {revenueBreakdown.map((item, i) => (
                        <div key={i} className="group">
                            <div className="flex justify-between items-end mb-3">
                                <div>
                                    <h4 className="font-black text-gray-900">{item.name}</h4>
                                    <span className="text-xs font-bold text-gray-400">{item.percent}% من الإجمالي</span>
                                </div>
                                <span className="text-lg font-black text-gray-900">{item.amount}</span>
                            </div>
                            <div className="w-full h-3 bg-gray-50 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${item.percent}%` }}
                                    transition={{ duration: 1, delay: 0.5 + i * 0.2 }}
                                    className={`h-full ${item.color}`}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="mt-10 pt-8 border-t border-gray-50 flex flex-wrap gap-4">
                    <button className="px-6 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl font-bold text-sm text-gray-600 transition-colors flex items-center gap-2">
                        <FileText size={16} />
                        تقرير الضرائب
                    </button>
                    <button className="px-6 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl font-bold text-sm text-gray-600 transition-colors flex items-center gap-2">
                        <PieChart size={16} />
                        تحليل المصروفات
                    </button>
                    <button className="px-6 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl font-bold text-sm text-gray-600 transition-colors flex items-center gap-2">
                        <TrendingUp size={16} />
                        توقعات الإيرادات
                    </button>
                </div>
            </div>
        </div>
    );
}
