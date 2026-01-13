import { Info, Clock, AlertCircle, Baby, CreditCard } from 'lucide-react';

export default function HotelPolicies() {
    return (
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Info className="text-primary-600" />
                <span>السياسات والتعليمات</span>
            </h2>

            <div className="grid md:grid-cols-2 gap-6">

                {/* Check-in/out */}
                <div className="bg-gray-50 p-4 rounded-2xl flex items-start gap-3">
                    <Clock className="text-gray-400 mt-1" size={20} />
                    <div>
                        <h3 className="font-bold text-gray-900 mb-1">تسجيل الدخول / الخروج</h3>
                        <p className="text-sm text-gray-600">تسجيل الدخول: من 4:00 مساءً</p>
                        <p className="text-sm text-gray-600">تسجيل الخروج: حتى 12:00 ظهراً</p>
                    </div>
                </div>

                {/* Children */}
                <div className="bg-gray-50 p-4 rounded-2xl flex items-start gap-3">
                    <Baby className="text-gray-400 mt-1" size={20} />
                    <div>
                        <h3 className="font-bold text-gray-900 mb-1">سياسة الأطفال</h3>
                        <p className="text-sm text-gray-600">يرحب بالأطفال من جميع الأعمار. الأطفال فوق 12 سنة يعتبرون بالغين في هذا الفندق.</p>
                    </div>
                </div>

                {/* Cancellation */}
                <div className="bg-gray-50 p-4 rounded-2xl flex items-start gap-3">
                    <AlertCircle className="text-gray-400 mt-1" size={20} />
                    <div>
                        <h3 className="font-bold text-gray-900 mb-1">الإلغاء والدفع المسبق</h3>
                        <p className="text-sm text-gray-600">تختلف سياسات الإلغاء والدفع المسبق حسب نوع الغرفة وموعد الحجز.</p>
                    </div>
                </div>

                {/* Cards */}
                <div className="bg-gray-50 p-4 rounded-2xl flex items-start gap-3">
                    <CreditCard className="text-gray-400 mt-1" size={20} />
                    <div>
                        <h3 className="font-bold text-gray-900 mb-1">طرق الدفع المقبولة</h3>
                        <div className="flex gap-2 mt-2">
                            {['visa', 'mastercard', 'mada'].map(card => (
                                <div key={card} className="w-8 h-5 bg-white rounded border border-gray-200" />
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
