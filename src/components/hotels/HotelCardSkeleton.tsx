'use client';

export default function HotelCardSkeleton() {
    return (
        <div className="bg-white border border-gray-100 rounded-[2.5rem] p-3 flex flex-col md:flex-row gap-6 shadow-sm overflow-hidden">
            {/* Image Skeleton with Shimmer */}
            <div className="w-full md:w-[48%] h-64 md:h-[19rem] relative shrink-0 rounded-[2rem] overflow-hidden bg-gray-200">
                <div className="absolute inset-0 skeleton-shimmer" />
            </div>

            {/* Content Skeleton */}
            <div className="flex-1 flex flex-col justify-center py-4">
                {/* Header Tags */}
                <div className="flex gap-3 mb-4">
                    <div className="h-7 w-24 rounded-full bg-gray-200 relative overflow-hidden">
                        <div className="absolute inset-0 skeleton-shimmer" />
                    </div>
                    <div className="h-7 w-16 rounded-full bg-gray-200 relative overflow-hidden">
                        <div className="absolute inset-0 skeleton-shimmer" />
                    </div>
                </div>

                {/* Title */}
                <div className="mb-2 h-9 w-3/4 rounded-xl bg-gray-200 relative overflow-hidden">
                    <div className="absolute inset-0 skeleton-shimmer" />
                </div>

                {/* Subtitle */}
                <div className="mb-6 h-5 w-1/2 rounded-lg bg-gray-200 relative overflow-hidden">
                    <div className="absolute inset-0 skeleton-shimmer" />
                </div>

                {/* Amenities */}
                <div className="flex gap-2 mb-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-10 w-24 rounded-full bg-gray-200 relative overflow-hidden">
                            <div className="absolute inset-0 skeleton-shimmer" />
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-50 pt-5 flex items-end justify-between">
                    <div className="space-y-2">
                        <div className="h-4 w-20 rounded bg-gray-200 relative overflow-hidden">
                            <div className="absolute inset-0 skeleton-shimmer" />
                        </div>
                        <div className="h-10 w-28 rounded-lg bg-gray-200 relative overflow-hidden">
                            <div className="absolute inset-0 skeleton-shimmer" />
                        </div>
                    </div>
                    <div className="h-14 w-36 rounded-2xl bg-gray-200 relative overflow-hidden">
                        <div className="absolute inset-0 skeleton-shimmer" />
                    </div>
                </div>
            </div>

            {/* Shimmer Animation Styles */}
            <style jsx>{`
                .skeleton-shimmer {
                    background: linear-gradient(
                        90deg,
                        transparent 0%,
                        rgba(255, 255, 255, 0.4) 50%,
                        transparent 100%
                    );
                    animation: shimmer 1.5s infinite;
                }
                
                @keyframes shimmer {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(100%);
                    }
                }
            `}</style>
        </div>
    );
}

// Variant for grid cards (smaller)
export function HotelCardSkeletonCompact() {
    return (
        <div className="bg-white border border-gray-100 rounded-3xl p-4 shadow-sm overflow-hidden">
            {/* Image */}
            <div className="w-full h-48 rounded-2xl bg-gray-200 relative overflow-hidden mb-4">
                <div className="absolute inset-0 skeleton-shimmer" />
            </div>

            {/* Content */}
            <div className="space-y-3">
                <div className="h-6 w-3/4 rounded-lg bg-gray-200 relative overflow-hidden">
                    <div className="absolute inset-0 skeleton-shimmer" />
                </div>
                <div className="h-4 w-1/2 rounded bg-gray-200 relative overflow-hidden">
                    <div className="absolute inset-0 skeleton-shimmer" />
                </div>
                <div className="flex justify-between items-center pt-2">
                    <div className="h-8 w-24 rounded-lg bg-gray-200 relative overflow-hidden">
                        <div className="absolute inset-0 skeleton-shimmer" />
                    </div>
                    <div className="h-10 w-28 rounded-xl bg-gray-200 relative overflow-hidden">
                        <div className="absolute inset-0 skeleton-shimmer" />
                    </div>
                </div>
            </div>

            <style jsx>{`
                .skeleton-shimmer {
                    background: linear-gradient(
                        90deg,
                        transparent 0%,
                        rgba(255, 255, 255, 0.4) 50%,
                        transparent 100%
                    );
                    animation: shimmer 1.5s infinite;
                }
                
                @keyframes shimmer {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(100%);
                    }
                }
            `}</style>
        </div>
    );
}
