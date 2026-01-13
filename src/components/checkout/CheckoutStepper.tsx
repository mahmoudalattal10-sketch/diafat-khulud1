'use client';

import { Check, User, CreditCard, ClipboardList } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StepperProps {
    currentStep: number;
}

export default function CheckoutStepper({ currentStep }: StepperProps) {
    const steps = [
        { id: 1, name: 'الملخص', icon: ClipboardList },
        { id: 2, name: 'البيانات', icon: User },
        { id: 3, name: 'الدفع', icon: CreditCard },
        { id: 4, name: 'التأكيد', icon: Check },
    ];

    return (
        <div className="w-full max-w-4xl mx-auto mb-12 px-4">
            <div className="relative flex justify-between">
                {/* Background Line */}
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 z-0" />

                {/* Progress Line */}
                <motion.div
                    initial={false}
                    animate={{
                        left: `${100 - ((currentStep - 1) / (steps.length - 1)) * 100}%`
                    }}
                    className="absolute top-1/2 left-full h-0.5 bg-primary-500 -translate-y-1/2 z-0 transition-all duration-500 ease-out"
                    style={{ right: '0' }}
                />

                {steps.map((step) => {
                    const Icon = step.icon;
                    const isActive = step.id === currentStep;
                    const isCompleted = step.id < currentStep;

                    return (
                        <div key={step.id} className="relative z-10 flex flex-col items-center">
                            <motion.div
                                initial={false}
                                animate={{
                                    scale: isActive ? 1.15 : 1,
                                    backgroundColor: isCompleted ? '#C5A059' : '#FFFFFF',
                                    borderColor: isActive ? '#C5A059' : isCompleted ? '#C5A059' : '#F3F4F6'
                                }}
                                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 border-[3px] shadow-sm ${isActive
                                        ? 'text-primary-600 bg-white ring-8 ring-primary-50'
                                        : isCompleted
                                            ? 'text-white'
                                            : 'text-gray-300'
                                    }`}
                            >
                                {isCompleted ? <Check size={24} strokeWidth={3} /> : <Icon size={24} />}

                                {/* Step Number Badge */}
                                <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full text-[10px] font-black flex items-center justify-center border-2 border-white shadow-md ${isActive || isCompleted ? 'bg-primary-600 text-white' : 'bg-gray-300 text-white'
                                    }`}>
                                    {step.id}
                                </div>
                            </motion.div>
                            <motion.span
                                animate={{
                                    color: isActive ? '#111827' : isCompleted ? '#6B7280' : '#D1D5DB'
                                }}
                                className={`mt-4 text-xs md:text-sm tracking-tight ${isActive ? 'font-black' : 'font-bold'}`}
                            >
                                {step.name}
                            </motion.span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
