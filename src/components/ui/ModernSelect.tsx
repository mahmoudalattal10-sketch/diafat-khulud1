'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
    value: string;
    label: string;
}

interface ModernSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: Option[];
    label?: string;
    placeholder?: string;
    className?: string;
}

export default function ModernSelect({
    value,
    onChange,
    options,
    label,
    placeholder = 'اختر خياراً',
    className = ''
}: ModernSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
                <span className={`font-bold text-sm ${selectedOption ? 'text-gray-900' : 'text-gray-400'}`}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-2 z-50 max-h-60 overflow-y-auto custom-scrollbar"
                    >
                        {options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${option.value === value
                                        ? 'bg-primary-50 text-primary-700'
                                        : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <span>{option.label}</span>
                                {option.value === value && <Check size={16} className="text-primary-500" />}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
