'use client';

import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Download, X } from 'lucide-react';

interface InvoiceTemplateProps {
    booking: any;
    onClose: () => void;
}

export default function InvoiceTemplate({ booking, onClose }: InvoiceTemplateProps) {
    const invoiceRef = useRef<HTMLDivElement>(null);

    const handleDownload = async () => {
        if (!invoiceRef.current) return;

        try {
            const canvas = await html2canvas(invoiceRef.current, {
                scale: 2,
                useCORS: true,
                logging: false
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`invoice_${booking.id}.pdf`);
        } catch (error) {
            console.error('PDF generation failed', error);
            alert('Failed to generate PDF');
        }
    };

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative flex flex-col">
                <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                    <h2 className="font-bold text-lg">معاينة الفاتورة</h2>
                    <div className="flex gap-2">
                        <button onClick={handleDownload} className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-primary-700">
                            <Download size={18} /> تحميل PDF
                        </button>
                        <button onClick={onClose} className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                            <X size={18} />
                        </button>
                    </div>
                </div>

                <div className="p-8 bg-gray-50 flex justify-center">
                    <div ref={invoiceRef} className="bg-white p-10 w-[210mm] min-h-[297mm] shadow-lg text-right" dir="rtl">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-10 pb-10 border-b-2 border-primary-500">
                            <div>
                                <h1 className="text-4xl font-black text-primary-700 mb-2">ضيافة خلود</h1>
                                <p className="text-gray-500 font-bold">DIAFAT KHULUD</p>
                            </div>
                            <div className="text-left">
                                <h2 className="text-3xl font-black text-gray-200">INVOICE</h2>
                                <p className="font-bold text-gray-900 mt-2">#{booking.id}</p>
                                <p className="text-sm text-gray-500">{new Date().toLocaleDateString('en-US')}</p>
                            </div>
                        </div>

                        {/* Bill To */}
                        <div className="grid grid-cols-2 gap-10 mb-12">
                            <div>
                                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">فاتورة إلى</h3>
                                <p className="font-bold text-xl text-gray-900 mb-1">{booking.user}</p>
                                <p className="text-gray-600">{booking.email}</p>
                                <p className="text-gray-600">{booking.phone || '0500000000'}</p>
                            </div>
                            <div className="text-left">
                                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">تفاصيل الحجز</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between gap-4">
                                        <span className="font-bold">تاريخ الوصول:</span>
                                        <span>{new Date(booking.checkIn).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between gap-4">
                                        <span className="font-bold">تاريخ المغادرة:</span>
                                        <span>{new Date(booking.checkIn).toLocaleDateString()}</span> {/* Mock checkOut logic for now */}
                                    </div>
                                    <div className="flex justify-between gap-4">
                                        <span className="font-bold">الحالة:</span>
                                        <span className="text-emerald-600 font-bold">{booking.status}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <table className="w-full mb-12">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-4 px-6 text-right font-black text-gray-600">الوصف</th>
                                    <th className="py-4 px-6 text-center font-black text-gray-600">الكمية</th>
                                    <th className="py-4 px-6 text-center font-black text-gray-600">السعر</th>
                                    <th className="py-4 px-6 text-left font-black text-gray-600">الإجمالي</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <tr>
                                    <td className="py-6 px-6">
                                        <p className="font-bold text-gray-900 mb-1">{booking.hotel}</p>
                                        <p className="text-sm text-gray-500">غرفة ديلوكس - شامل الإفطار</p>
                                    </td>
                                    <td className="py-6 px-6 text-center font-bold">5 ليالي</td> {/* Mock */}
                                    <td className="py-6 px-6 text-center font-bold">{Math.round(booking.amount / 5)} ر.س</td>
                                    <td className="py-6 px-6 text-left font-bold">{booking.amount} ر.س</td>
                                </tr>
                            </tbody>
                        </table>

                        {/* Totals */}
                        <div className="flex justify-end mb-12">
                            <div className="w-1/2 space-y-3">
                                <div className="flex justify-between text-gray-600">
                                    <span>المجموع الفرعي</span>
                                    <span className="font-bold">{booking.amount} ر.س</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>الضريبة (15%)</span>
                                    <span className="font-bold">0.00 ر.س</span> {/* Assuming inclusive */}
                                </div>
                                <div className="border-t-2 border-gray-900 pt-3 flex justify-between text-xl font-black text-gray-900">
                                    <span>الإجمالي الكلي</span>
                                    <span>{booking.amount} ر.س</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="border-t border-gray-100 pt-8 text-center text-gray-500 text-sm">
                            <p className="mb-2">شكراً لتعاملكم مع ضيافة خلود</p>
                            <p>info@diafat-khulud.com | +966 50 000 0000</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
