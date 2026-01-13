'use client';

import React, { useState, useEffect, ChangeEvent, FocusEvent } from 'react';

interface NumericInputProps {
    value: number | string;
    onChange: (value: number) => void;
    className?: string;
    placeholder?: string;
    min?: number;
    max?: number;
    step?: number;
    suffix?: string;
    readOnly?: boolean;
    title?: string;
}

/**
 * NumericInput - A text input that handles numeric values properly
 * Allows typing without resetting to 0, converts to number on blur
 */
export default function NumericInput({
    value,
    onChange,
    className = '',
    placeholder = '',
    min,
    max,
    step,
    suffix,
    readOnly = false,
    title
}: NumericInputProps) {
    // Store internal string value for smooth typing experience
    const [internalValue, setInternalValue] = useState<string>(String(value ?? ''));

    // Sync with external value when it changes (e.g., from parent or API)
    useEffect(() => {
        setInternalValue(String(value ?? ''));
    }, [value]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;

        // Allow empty string, digits, and one decimal point
        if (val === '' || /^-?\d*\.?\d*$/.test(val)) {
            setInternalValue(val);

            // Also call onChange with parsed value for real-time updates if valid number
            const parsed = parseFloat(val);
            if (!isNaN(parsed)) {
                onChange(parsed);
            }
        }
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
        // Parse the value on blur
        let num = parseFloat(internalValue) || 0;

        // Apply min/max constraints
        if (min !== undefined && num < min) num = min;
        if (max !== undefined && num > max) num = max;

        // Update both internal and external values
        setInternalValue(String(num));
        onChange(num);
    };

    return (
        <div className="relative">
            <input
                type="text"
                inputMode="decimal"
                value={internalValue}
                onChange={handleChange}
                onBlur={handleBlur}
                className={className}
                placeholder={placeholder}
                readOnly={readOnly}
                title={title}
            />
            {suffix && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-bold pointer-events-none">
                    {suffix}
                </span>
            )}
        </div>
    );
}
