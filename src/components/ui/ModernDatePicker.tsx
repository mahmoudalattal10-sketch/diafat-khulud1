'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, X, ChevronDown } from 'lucide-react';

interface ModernDatePickerProps {
    value: Date | string | null;
    onChange: (date: Date | null) => void;
    label?: string;
    placeholder?: string;
    minDate?: Date;
    className?: string;
}

const ARABIC_MONTHS = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
];

const ARABIC_DAYS = ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];

export default function ModernDatePicker({
    value,
    onChange,
    label,
    placeholder = 'اختر التاريخ',
    minDate,
    className = ''
}: ModernDatePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const containerRef = useRef<HTMLDivElement>(null);

    // Parse value to Date object
    const selectedDate = value ? new Date(value) : null;

    useEffect(() => {
        if (selectedDate && !isNaN(selectedDate.getTime())) {
            setCurrentMonth(selectedDate);
        }
    }, [isOpen]); // Reset month to selected date when opening

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();

        const days: (Date | null)[] = [];
        for (let i = 0; i < startingDay; i++) days.push(null);
        for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));

        return days;
    };

    const isSameDate = (date1: Date, date2: Date | null) => {
        return date2 && date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear();
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return isSameDate(date, today);
    };

    const isDisabled = (date: Date) => {
        if (minDate) {
            const checkDate = new Date(date);
            checkDate.setHours(23, 59, 59, 999);
            const min = new Date(minDate);
            min.setHours(0, 0, 0, 0);
            return checkDate < min;
        }
        return false;
    };

    const handleDateClick = (date: Date) => {
        if (isDisabled(date)) return;
        // Fix timezone offset issue by setting time to noon
        const newDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0));
        onChange(newDate);
        setIsOpen(false);
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const days = getDaysInMonth(currentMonth);

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            {label && (
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                    {label}
                </label>
            )}

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full h-14 px-4 bg-gray-50 rounded-xl border-2 transition-all flex items-center justify-between group ${isOpen ? 'border-primary-500 bg-white' : 'border-transparent hover:bg-gray-100'
                    }`}
            >
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${selectedDate ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-500'
                        }`}>
                        <Calendar size={16} />
                    </div>
                    <span className={`font-bold text-sm ${selectedDate ? 'text-gray-900' : 'text-gray-400'}`}>
                        {selectedDate && !isNaN(selectedDate.getTime())
                            ? selectedDate.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })
                            : placeholder}
                    </span>
                </div>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-4 z-50 min-w-[300px]"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <button
                                type="button"
                                onClick={prevMonth}
                                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                            >
                                <ChevronRight size={18} />
                            </button>
                            <span className="font-bold text-gray-900">
                                {ARABIC_MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                            </span>
                            <button
                                type="button"
                                onClick={nextMonth}
                                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                            >
                                <ChevronLeft size={18} />
                            </button>
                        </div>

                        {/* Week Days */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {ARABIC_DAYS.map(day => (
                                <div key={day} className="text-center text-[10px] font-bold text-gray-400">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-1">
                            {days.map((date, i) => (
                                <div key={i} className="aspect-square">
                                    {date && (
                                        <button
                                            type="button"
                                            onClick={() => handleDateClick(date)}
                                            disabled={isDisabled(date)}
                                            className={`w-full h-full rounded-lg text-xs font-bold flex items-center justify-center transition-all ${isDisabled(date)
                                                    ? 'text-gray-300 cursor-not-allowed'
                                                    : isSameDate(date, selectedDate)
                                                        ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30 scale-105'
                                                        : isToday(date)
                                                            ? 'bg-primary-50 text-primary-600 border border-primary-200'
                                                            : 'text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            {date.getDate()}
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Footer - Clear Button */}
                        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                            <button
                                type="button"
                                onClick={() => {
                                    onChange(null);
                                    setIsOpen(false);
                                }}
                                className="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                مسح التاريخ
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
