import Link from 'next/link';
import { CheckCircle, Home, Calendar } from 'lucide-react';

export default function SuccessPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-gray-100 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={48} className="text-green-600" />
                </div>

                <h1 className="text-3xl font-black text-gray-900 mb-2">تم الحجز بنجاح!</h1>
                <p className="text-gray-500 mb-8 font-medium">
                    شكراً لثقتك بنا. تم تأكيد حجزك وإرسال التفاصيل إلى بريدك الإلكتروني.
                </p>

                <div className="space-y-3">
                    <Link
                        href="/"
                        className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all"
                    >
                        <Home size={20} />
                        <span>العودة للرئيسية</span>
                    </Link>
                    <Link
                        href="#"
                        className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-900 font-bold py-4 rounded-xl transition-all"
                    >
                        <Calendar size={20} />
                        <span>عرض تفاصيل الحجز</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
