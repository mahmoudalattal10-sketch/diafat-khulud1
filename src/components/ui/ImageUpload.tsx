'use client';

import { useState } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
    value?: string[];
    onChange: (urls: string[]) => void;
    maxFiles?: number;
}

export default function ImageUpload({ value = [], onChange, maxFiles = 5 }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        const newUrls: string[] = [];

        try {
            for (let i = 0; i < files.length; i++) {
                // Simple validation
                if (!files[i].type.startsWith('image/')) continue;

                const formData = new FormData();
                formData.append('file', files[i]);

                const res = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (res.ok) {
                    const data = await res.json();
                    newUrls.push(data.url);
                } else {
                    console.error('Failed to upload file');
                }
            }

            // Append new URLs to existing value
            onChange([...value, ...newUrls]);
        } catch (error) {
            console.error('Upload Error', error);
        } finally {
            setIsUploading(false);
            // Reset input
            e.target.value = '';
        }
    };

    const handleRemove = (urlToRemove: string) => {
        onChange(value.filter(url => url !== urlToRemove));
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {value.map((url, idx) => (
                    <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-gray-200 group">
                        <Image
                            src={url}
                            alt="Uploaded image"
                            fill
                            className="object-cover"
                        />
                        <button
                            type="button"
                            onClick={() => handleRemove(url)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}

                {value.length < maxFiles && (
                    <label className="relative flex flex-col items-center justify-center aspect-video border-2 border-dashed border-gray-300 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {isUploading ? (
                                <Loader2 className="w-8 h-8 text-gray-400 animate-spin mb-2" />
                            ) : (
                                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                            )}
                            <p className="text-xs text-gray-500 font-bold">
                                {isUploading ? 'جاري الرفع...' : 'اضغط للرفع'}
                            </p>
                        </div>
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            multiple
                            disabled={isUploading}
                            onChange={handleUpload}
                        />
                    </label>
                )}
            </div>
            {value.length === 0 && (
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <ImageIcon size={16} />
                    <span>لا توجد صور مختارة</span>
                </div>
            )}
        </div>
    );
}
