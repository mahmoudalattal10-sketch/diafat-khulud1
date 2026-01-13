'use client';

import { useState, useEffect } from 'react';
import { Star, ThumbsUp, PenLine, Loader2, Send } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface Review {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    user: {
        name: string | null;
    };
}

interface HotelReviewsProps {
    hotelId: number;
}

export default function HotelReviews({ hotelId }: HotelReviewsProps) {
    const { data: session } = useSession();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [isWriting, setIsWriting] = useState(false);
    const [newRating, setNewRating] = useState(5);
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch(`/api/reviews?hotelId=${hotelId}`);
                if (res.ok) {
                    const data = await res.json();
                    setReviews(data);
                }
            } catch (error) {
                console.error('Failed to fetch reviews', error);
            } finally {
                setLoading(false);
            }
        };

        if (hotelId) {
            fetchReviews();
        }
    }, [hotelId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setSubmitting(true);
        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    hotelId,
                    rating: newRating,
                    comment: newComment
                })
            });

            if (res.ok) {
                const newReview = await res.json();
                // Optimistically add to list (fetching name from session)
                setReviews([{
                    ...newReview,
                    user: { name: session?.user?.name || 'مستخدم' }
                }, ...reviews]);
                setIsWriting(false);
                setNewComment('');
                setNewRating(5);
            }
        } catch (error) {
            console.error('Submit review error', error);
        } finally {
            setSubmitting(false);
        }
    };

    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : '0.0';

    return (
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Star className="text-primary-500 fill-current" />
                    <span>تقييمات النزلاء</span>
                </h2>
                {session?.user && !isWriting && (
                    <button
                        onClick={() => setIsWriting(true)}
                        className="text-primary-600 font-bold text-sm hover:bg-primary-50 px-4 py-2 rounded-xl transition-all flex items-center gap-2"
                    >
                        <PenLine size={16} />
                        أكتب تقييماً
                    </button>
                )}
            </div>

            {/* Writing Form */}
            {isWriting && (
                <form onSubmit={handleSubmit} className="mb-8 bg-gray-50 p-6 rounded-2xl border border-gray-200 animate-in fade-in slide-in-from-top-4">
                    <div className="flex items-center gap-2 mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setNewRating(star)}
                                className="transition-transform hover:scale-110 focus:outline-none"
                            >
                                <Star
                                    size={24}
                                    className={`${star <= newRating ? 'text-primary-500 fill-primary-500' : 'text-gray-300'}`}
                                />
                            </button>
                        ))}
                    </div>
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="شاركنا تجربتك في هذا الفندق..."
                        className="w-full h-32 p-4 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none mb-4"
                        required
                    />
                    <div className="flex gap-2 justify-end">
                        <button
                            type="button"
                            onClick={() => setIsWriting(false)}
                            className="px-6 py-2 rounded-xl font-bold text-gray-500 hover:bg-gray-200"
                        >
                            إلغاء
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-6 py-2 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 flex items-center gap-2 disabled:opacity-50"
                        >
                            {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                            نشر التقييم
                        </button>
                    </div>
                </form>
            )}

            {/* Overall Rating */}
            <div className="flex flex-col md:flex-row items-center gap-8 mb-10 bg-gray-50 p-6 rounded-2xl">
                <div className="text-center md:text-right shrink-0">
                    <div className="text-5xl font-black text-gray-900 mb-2">{averageRating}</div>
                    <div className="text-sm font-bold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full inline-block mb-2">
                        {Number(averageRating) >= 4.5 ? 'مـمتاز' : Number(averageRating) >= 3.5 ? 'جيد جداً' : 'جيد'}
                    </div>
                    <p className="text-xs text-gray-500">بناءً على {reviews.length} تقييم</p>
                </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
                {loading ? (
                    <div className="text-center py-10 text-gray-400">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                        <p>جاري تحميل التقييمات...</p>
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">
                        <p>لا توجد تقييمات بعد. كن أول من يقيم هذا الفندق!</p>
                    </div>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center">
                                        {(review.user?.name || '?')[0]}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-gray-900">{review.user?.name || 'مستخدم'}</h4>
                                        <span className="text-xs text-gray-400">
                                            {new Date(review.createdAt).toLocaleDateString('ar-EG')}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                                    <Star size={12} className="text-primary-500 fill-current" />
                                    <span className="text-xs font-bold">{review.rating}</span>
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed mb-3">"{review.comment}"</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
