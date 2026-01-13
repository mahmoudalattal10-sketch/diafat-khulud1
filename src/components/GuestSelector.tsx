'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Minus, Baby, User, DoorOpen, ChevronDown, Check, X } from 'lucide-react';

interface GuestData {
    adults: number;
    children: number;
    childAges: number[];
    rooms: number;
}

interface GuestSelectorProps {
    guestData: GuestData;
    onGuestChange: (data: GuestData) => void;
    isOpen: boolean;
    onToggle: () => void;
    onClose: () => void;
    customTrigger?: (props: { onClick: () => void; isOpen: boolean; guestData: GuestData }) => React.ReactNode;
}

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

const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: {
            delay: i * 0.05,
            type: "spring",
            stiffness: 300,
            damping: 24,
        }
    })
};

export default function GuestSelector({
    guestData,
    onGuestChange,
    isOpen,
    onToggle,
    onClose,
    customTrigger
}: GuestSelectorProps) {

    const updateAdults = (delta: number) => {
        const newAdults = Math.max(1, Math.min(10, guestData.adults + delta));
        onGuestChange({ ...guestData, adults: newAdults });
    };

    const updateChildren = (delta: number) => {
        const newChildren = Math.max(0, Math.min(6, guestData.children + delta));
        let newChildAges = [...guestData.childAges];

        if (delta > 0) {
            // Add a child with default age 5
            newChildAges.push(5);
        } else if (delta < 0 && newChildAges.length > 0) {
            // Remove last child
            newChildAges.pop();
        }

        onGuestChange({ ...guestData, children: newChildren, childAges: newChildAges });
    };

    const updateChildAge = (index: number, age: number) => {
        const newAges = [...guestData.childAges];
        newAges[index] = age;
        onGuestChange({ ...guestData, childAges: newAges });
    };

    const updateRooms = (delta: number) => {
        const newRooms = Math.max(1, Math.min(10, guestData.rooms + delta));
        onGuestChange({ ...guestData, rooms: newRooms });
    };

    const totalGuests = guestData.adults + guestData.children;

    const getSummaryText = () => {
        const parts = [];
        if (guestData.adults > 0) {
            parts.push(`${guestData.adults} بالغ`);
        }
        if (guestData.children > 0) {
            parts.push(`${guestData.children} طفل`);
        }
        if (guestData.rooms > 0) {
            parts.push(`${guestData.rooms} غرفة`);
        }
        return parts.join(' • ') || 'اختر عدد المسافرين';
    };

    return (
        <div className="relative z-20">
            {!customTrigger && (
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Users size={16} className="text-primary-500" />
                    <span>المسافرون والغرف</span>
                </label>
            )}

            {/* Trigger Button */}
            {customTrigger ? (
                customTrigger({ onClick: onToggle, isOpen, guestData })
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
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                            <Users size={18} className="text-primary-600" />
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-gray-400">المسافرون</div>
                            <div className="text-sm text-gray-900 font-semibold">
                                {getSummaryText()}
                            </div>
                        </div>
                    </div>

                    <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <ChevronDown size={20} className="text-gray-400" />
                    </motion.div>
                </motion.button>
            )}

            {/* Popup */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        variants={popupVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="absolute top-full right-0 md:right-auto md:left-0 w-full md:w-[26rem] mt-2 bg-white rounded-3xl shadow-2xl shadow-gray-200/60 border border-gray-100 overflow-hidden z-50 max-h-[70vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
                            <h3 className="font-bold text-gray-900">اختر عدد المسافرين والغرف</h3>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
                            >
                                <X size={18} className="text-gray-400" />
                            </button>
                        </div>

                        <div className="p-4 space-y-4">

                            {/* Adults */}
                            <motion.div
                                custom={0}
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center">
                                        <User size={22} className="text-primary-600" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900">البالغين</div>
                                        <div className="text-sm text-gray-500">12 سنة فأكثر</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => updateAdults(-1)}
                                        disabled={guestData.adults <= 1}
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${guestData.adults <= 1
                                            ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                            : 'bg-primary-100 text-primary-600 hover:bg-primary-200'
                                            }`}
                                    >
                                        <Minus size={18} />
                                    </motion.button>
                                    <span className="w-8 text-center font-bold text-lg text-gray-900">{guestData.adults}</span>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => updateAdults(1)}
                                        disabled={guestData.adults >= 10}
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${guestData.adults >= 10
                                            ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                            : 'bg-primary-500 text-white hover:bg-primary-600 shadow-lg shadow-primary-500/30'
                                            }`}
                                    >
                                        <Plus size={18} />
                                    </motion.button>
                                </div>
                            </motion.div>

                            {/* Children */}
                            <motion.div
                                custom={1}
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-secondary-100 rounded-2xl flex items-center justify-center">
                                        <Baby size={22} className="text-secondary-600" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900">الأطفال</div>
                                        <div className="text-sm text-gray-500">أقل من 12 سنة</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => updateChildren(-1)}
                                        disabled={guestData.children <= 0}
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${guestData.children <= 0
                                            ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                            : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
                                            }`}
                                    >
                                        <Minus size={18} />
                                    </motion.button>
                                    <span className="w-8 text-center font-bold text-lg text-gray-900">{guestData.children}</span>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => updateChildren(1)}
                                        disabled={guestData.children >= 6}
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${guestData.children >= 6
                                            ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                            : 'bg-secondary-500 text-white hover:bg-secondary-600 shadow-lg shadow-secondary-500/30'
                                            }`}
                                    >
                                        <Plus size={18} />
                                    </motion.button>
                                </div>
                            </motion.div>

                            {/* Child Ages */}
                            <AnimatePresence>
                                {guestData.children > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-3"
                                    >
                                        <div className="text-sm font-semibold text-gray-700 pr-2">أعمار الأطفال</div>
                                        <div className="grid grid-cols-2 gap-3">
                                            {guestData.childAges.map((age, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.9 }}
                                                    className="bg-gradient-to-br from-secondary-50 to-green-50 rounded-2xl p-3 border border-secondary-200"
                                                >
                                                    <div className="text-xs text-secondary-600 font-medium mb-2">الطفل {index + 1}</div>
                                                    <select
                                                        value={age}
                                                        onChange={(e) => updateChildAge(index, parseInt(e.target.value))}
                                                        className="w-full px-3 py-2 rounded-xl bg-white border border-secondary-200 text-gray-900 font-semibold text-sm focus:outline-none focus:border-secondary-400 focus:ring-2 focus:ring-secondary-100"
                                                    >
                                                        {[...Array(12)].map((_, i) => (
                                                            <option key={i} value={i}>{i === 0 ? 'أقل من سنة' : `${i} سنة`}</option>
                                                        ))}
                                                    </select>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Divider */}
                            <div className="border-t border-gray-100 my-2" />

                            {/* Rooms */}
                            <motion.div
                                custom={2}
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                className="flex items-center justify-between p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                                        <DoorOpen size={22} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900">الغرف</div>
                                        <div className="text-sm text-gray-500">عدد الغرف المطلوبة</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => updateRooms(-1)}
                                        disabled={guestData.rooms <= 1}
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${guestData.rooms <= 1
                                            ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                            : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                                            }`}
                                    >
                                        <Minus size={18} />
                                    </motion.button>
                                    <span className="w-8 text-center font-bold text-lg text-gray-900">{guestData.rooms}</span>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => updateRooms(1)}
                                        disabled={guestData.rooms >= 10}
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${guestData.rooms >= 10
                                            ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                            : 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg shadow-blue-500/30'
                                            }`}
                                    >
                                        <Plus size={18} />
                                    </motion.button>
                                </div>
                            </motion.div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between p-4 bg-gray-50 border-t border-gray-100">
                            <div className="text-sm text-gray-600">
                                <span className="font-bold text-primary-600">{totalGuests}</span> مسافر
                                {' • '}
                                <span className="font-bold text-blue-600">{guestData.rooms}</span> غرفة
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onClose}
                                className="px-6 py-2.5 bg-primary-500 text-white rounded-xl font-semibold text-sm hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/20"
                            >
                                <div className="flex items-center gap-2">
                                    <Check size={16} />
                                    <span>تأكيد</span>
                                </div>
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
