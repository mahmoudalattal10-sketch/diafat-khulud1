'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, X } from 'lucide-react';

interface DateRangePickerProps {
    startDate: Date | null;
    endDate: Date | null;
    onDateChange: (start: Date | null, end: Date | null) => void;
    isOpen: boolean;
    onToggle: () => void;
    onClose: () => void;
    customTrigger?: (props: { onClick: () => void; isOpen: boolean; startDate: Date | null; endDate: Date | null }) => React.ReactNode;
}

const ARABIC_MONTHS = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
];

const ARABIC_DAYS = ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];

const popupVariants = {
    hidden: {
        opacity: 0,
        y: -10,
        scale: 0.95,
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 24,
        }
    },
    exit: {
        opacity: 0,
        y: -10,
        scale: 0.95,
        transition: {
            duration: 0.2,
        }
    }
};

export default function DateRangePicker({
    startDate,
    endDate,
    onDateChange,
    isOpen,
    onToggle,
    onClose,
    customTrigger
}: DateRangePickerProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectingEnd, setSelectingEnd] = useState(false);
    const [hoverDate, setHoverDate] = useState<Date | null>(null);

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();

        const days: (Date | null)[] = [];

        // Add empty slots for days before the first day of the month
        for (let i = 0; i < startingDay; i++) {
            days.push(null);
        }

        // Add all days in the month
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }

        return days;
    };

    const isDateInRange = (date: Date) => {
        if (!startDate) return false;

        const endToCheck = hoverDate || endDate;
        if (!endToCheck) return false;

        const start = startDate.getTime();
        const end = endToCheck.getTime();
        const current = date.getTime();

        return current > Math.min(start, end) && current < Math.max(start, end);
    };

    const isStartDate = (date: Date) => {
        return startDate && date.toDateString() === startDate.toDateString();
    };

    const isEndDate = (date: Date) => {
        const endToCheck = hoverDate || endDate;
        return endToCheck && date.toDateString() === endToCheck.toDateString();
    };

    const isToday = (date: Date) => {
        return date.toDateString() === new Date().toDateString();
    };

    const isPastDate = (date: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    const handleDateClick = (date: Date) => {
        if (isPastDate(date)) return;

        if (!startDate || selectingEnd === false) {
            // First click - set start date
            onDateChange(date, null);
            setSelectingEnd(true);
        } else {
            // Second click - set end date
            if (date < startDate) {
                // If selected date is before start, swap them
                onDateChange(date, startDate);
            } else {
                onDateChange(startDate, date);
            }
            setSelectingEnd(false);
            onClose();
        }
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const prevMonth = () => {
        const today = new Date();
        const prevMonthDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
        // Don't allow going before current month
        if (prevMonthDate >= new Date(today.getFullYear(), today.getMonth(), 1)) {
            setCurrentMonth(prevMonthDate);
        }
    };

    const formatDate = (date: Date | null) => {
        if (!date) return '';
        return `${date.getDate()} ${ARABIC_MONTHS[date.getMonth()]}`;
    };

    const days = getDaysInMonth(currentMonth);
    const canGoPrev = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1) > new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    return (
        <div className="relative z-30">
            {!customTrigger && (
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Calendar size={16} className="text-primary-500" />
                    <span>تاريخ الرحلة</span>
                </label>
            )}

            {/* Trigger Button */}
            {customTrigger ? (
                customTrigger({ onClick: onToggle, isOpen, startDate, endDate })
            ) : (
                <motion.button
                    type="button"
                    onClick={onToggle}
                    className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border-2 transition-all duration-300 ${isOpen
                        ? 'border-primary-500 bg-primary-50/50 ring-4 ring-primary-100'
                        : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                        }`}
                    whileTap={{ scale: 0.995 }}
                >
                    <div className="flex items-center gap-4">
                        {/* Start Date */}
                        <div className="text-right">
                            <div className="text-xs text-gray-400 mb-0.5">الذهاب</div>
                            <div className={startDate ? 'text-gray-900 font-semibold' : 'text-gray-400'}>
                                {startDate ? formatDate(startDate) : 'اختر التاريخ'}
                            </div>
                        </div>

                        {/* Arrow */}
                        <div className="flex items-center gap-1">
                            <div className="w-8 h-0.5 bg-gray-300 rounded-full" />
                            <ChevronLeft size={16} className="text-gray-400" />
                        </div>

                        {/* End Date */}
                        <div className="text-right">
                            <div className="text-xs text-gray-400 mb-0.5">العودة</div>
                            <div className={endDate ? 'text-gray-900 font-semibold' : 'text-gray-400'}>
                                {endDate ? formatDate(endDate) : 'اختر التاريخ'}
                            </div>
                        </div>
                    </div>

                    <Calendar size={20} className="text-gray-400" />
                </motion.button>
            )}

            {/* Calendar Popup - Single Calendar */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        variants={popupVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-3xl shadow-2xl shadow-gray-200/60 border border-gray-100 overflow-hidden z-50 max-h-[70vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header with Selection Status */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-l from-secondary-50 to-primary-50">
                            <div className="flex items-center gap-3">
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${!selectingEnd ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' : 'bg-white text-gray-600'
                                    }`}>
                                    <div className={`w-2 h-2 rounded-full ${!selectingEnd ? 'bg-white' : 'bg-primary-500'}`} />
                                    <span>الذهاب</span>
                                </div>
                                <ChevronLeft size={16} className="text-gray-400" />
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${selectingEnd ? 'bg-secondary-500 text-white shadow-lg shadow-secondary-500/30' : 'bg-white text-gray-600'
                                    }`}>
                                    <div className={`w-2 h-2 rounded-full ${selectingEnd ? 'bg-white' : 'bg-secondary-500'}`} />
                                    <span>العودة</span>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/80 transition-colors"
                            >
                                <X size={18} className="text-gray-500" />
                            </button>
                        </div>

                        {/* Single Calendar */}
                        <div className="p-5">
                            {/* Month Navigation */}
                            <div className="flex items-center justify-between mb-5">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={prevMonth}
                                    disabled={!canGoPrev}
                                    className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${canGoPrev
                                        ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                        : 'bg-gray-50 text-gray-300 cursor-not-allowed'
                                        }`}
                                >
                                    <ChevronRight size={20} />
                                </motion.button>

                                <motion.h3
                                    key={currentMonth.toISOString()}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-xl font-bold text-gray-900"
                                >
                                    {ARABIC_MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                                </motion.h3>

                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={nextMonth}
                                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all"
                                >
                                    <ChevronLeft size={20} />
                                </motion.button>
                            </div>

                            {/* Day Names */}
                            <div className="grid grid-cols-7 gap-1 mb-3">
                                {ARABIC_DAYS.map((day) => (
                                    <div key={day} className="text-center text-xs font-semibold text-gray-400 py-2">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Days Grid */}
                            <motion.div
                                key={currentMonth.toISOString()}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.2 }}
                                className="grid grid-cols-7 gap-1"
                            >
                                {days.map((date, index) => (
                                    <div key={index} className="aspect-square p-0.5">
                                        {date && (
                                            <motion.button
                                                type="button"
                                                onClick={() => handleDateClick(date)}
                                                onMouseEnter={() => selectingEnd && setHoverDate(date)}
                                                onMouseLeave={() => setHoverDate(null)}
                                                disabled={isPastDate(date)}
                                                className={`w-full h-full flex items-center justify-center text-sm font-semibold rounded-xl transition-all duration-200 ${isPastDate(date)
                                                    ? 'text-gray-300 cursor-not-allowed'
                                                    : isStartDate(date)
                                                        ? 'bg-gradient-to-br from-primary-400 to-primary-500 text-white shadow-lg shadow-primary-500/40'
                                                        : isEndDate(date)
                                                            ? 'bg-gradient-to-br from-secondary-400 to-secondary-500 text-white shadow-lg shadow-secondary-500/40'
                                                            : isDateInRange(date)
                                                                ? 'bg-primary-50 text-primary-700'
                                                                : isToday(date)
                                                                    ? 'border-2 border-primary-500 text-primary-600 font-bold'
                                                                    : 'text-gray-700 hover:bg-gray-100'
                                                    }`}
                                                whileHover={!isPastDate(date) ? { scale: 1.15 } : undefined}
                                                whileTap={!isPastDate(date) ? { scale: 0.95 } : undefined}
                                            >
                                                {date.getDate()}
                                            </motion.button>
                                        )}
                                    </div>
                                ))}
                            </motion.div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between p-4 bg-gray-50 border-t border-gray-100">
                            <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-gradient-to-br from-primary-500 to-primary-600 rounded-md shadow" />
                                    <span className="text-gray-600">تاريخ الذهاب</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-gradient-to-br from-primary-400 to-primary-500 rounded-md shadow" />
                                    <span className="text-gray-600">تاريخ العودة</span>
                                </div>
                            </div>

                            {startDate && endDate && (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={onClose}
                                    className="px-6 py-2.5 bg-gradient-to-l from-primary-500 to-primary-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-primary-500/30 transition-all"
                                >
                                    تأكيد
                                </motion.button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
