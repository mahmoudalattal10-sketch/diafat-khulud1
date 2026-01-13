'use client';

import { motion } from 'framer-motion';
import { Check, User, CreditCard, CheckCircle } from 'lucide-react';

interface BookingProgressBarProps {
    currentStep: number; // 1, 2, 3, or 4
    steps?: { label: string; icon: any }[];
}

const DEFAULT_STEPS = [
    { label: 'اختيار الغرفة', icon: Check },
    { label: 'بيانات الحجز', icon: User },
    { label: 'الدفع', icon: CreditCard },
    { label: 'التأكيد', icon: CheckCircle },
];

export default function BookingProgressBar({ currentStep, steps = DEFAULT_STEPS }: BookingProgressBarProps) {
    return (
        <div className="w-full bg-white rounded-2xl p-6 shadow-sm border border-gray-100" dir="rtl">
            <div className="relative flex justify-between items-center">
                {/* Progress Line Background */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 rounded-full -translate-y-1/2 z-0" />

                {/* Progress Line Fill */}
                <motion.div
                    className="absolute top-1/2 right-0 h-1 bg-gradient-to-l from-primary-500 to-secondary-500 rounded-full -translate-y-1/2 z-0"
                    initial={{ width: '0%' }}
                    animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                />

                {/* Steps */}
                {steps.map((step, index) => {
                    const stepNumber = index + 1;
                    const isCompleted = stepNumber < currentStep;
                    const isCurrent = stepNumber === currentStep;
                    const Icon = step.icon;

                    return (
                        <div key={index} className="relative z-10 flex flex-col items-center">
                            {/* Step Circle */}
                            <motion.div
                                initial={{ scale: 0.8 }}
                                animate={{
                                    scale: isCurrent ? 1.1 : 1,
                                    backgroundColor: isCompleted || isCurrent
                                        ? (isCompleted ? '#1B5E3A' : '#C9A227')
                                        : '#F3F4F6'
                                }}
                                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${isCurrent
                                        ? 'ring-4 ring-primary-100 ring-offset-2'
                                        : ''
                                    }`}
                            >
                                {isCompleted ? (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', stiffness: 300 }}
                                    >
                                        <Check size={24} className="text-white" strokeWidth={3} />
                                    </motion.div>
                                ) : (
                                    <Icon
                                        size={20}
                                        className={isCurrent ? 'text-black' : 'text-gray-400'}
                                    />
                                )}
                            </motion.div>

                            {/* Step Label */}
                            <motion.span
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`mt-3 text-xs font-bold whitespace-nowrap ${isCurrent
                                        ? 'text-primary-600'
                                        : isCompleted
                                            ? 'text-secondary-600'
                                            : 'text-gray-400'
                                    }`}
                            >
                                {step.label}
                            </motion.span>

                            {/* Current Step Indicator */}
                            {isCurrent && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -bottom-6 left-1/2 -translate-x-1/2"
                                >
                                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
                                </motion.div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
