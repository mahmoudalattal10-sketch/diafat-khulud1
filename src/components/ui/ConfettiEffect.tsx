'use client';

import { useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiEffectProps {
    trigger: boolean;
    onComplete?: () => void;
}

export default function ConfettiEffect({ trigger, onComplete }: ConfettiEffectProps) {

    const fireConfetti = useCallback(() => {
        // Islamic-themed colors (gold, green, white)
        const colors = ['#C9A227', '#1B5E3A', '#FFFFFF', '#D4AF37', '#2E7D32'];

        const duration = 3000;
        const animationEnd = Date.now() + duration;

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                clearInterval(interval);
                onComplete?.();
                return;
            }

            const particleCount = 50 * (timeLeft / duration);

            // Left side burst
            confetti({
                particleCount: Math.floor(particleCount / 2),
                startVelocity: 30,
                spread: 60,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                colors: colors,
                shapes: ['circle', 'square'],
                scalar: randomInRange(0.8, 1.2),
            });

            // Right side burst
            confetti({
                particleCount: Math.floor(particleCount / 2),
                startVelocity: 30,
                spread: 60,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                colors: colors,
                shapes: ['circle', 'square'],
                scalar: randomInRange(0.8, 1.2),
            });
        }, 250);

        // Initial big burst from center
        confetti({
            particleCount: 100,
            spread: 100,
            origin: { x: 0.5, y: 0.5 },
            colors: colors,
            startVelocity: 45,
        });
    }, [onComplete]);

    useEffect(() => {
        if (trigger) {
            fireConfetti();
        }
    }, [trigger, fireConfetti]);

    return null;
}

// Helper function to trigger confetti anywhere
export function triggerBookingConfetti() {
    const colors = ['#C9A227', '#1B5E3A', '#FFFFFF', '#D4AF37'];

    // Stars burst effect
    const defaults = {
        spread: 360,
        ticks: 100,
        gravity: 0,
        decay: 0.94,
        startVelocity: 30,
        colors: colors,
    };

    function shoot() {
        confetti({
            ...defaults,
            particleCount: 40,
            scalar: 1.2,
            shapes: ['star'],
        });

        confetti({
            ...defaults,
            particleCount: 10,
            scalar: 0.75,
            shapes: ['circle'],
        });
    }

    setTimeout(shoot, 0);
    setTimeout(shoot, 100);
    setTimeout(shoot, 200);

    // Side cannons
    setTimeout(() => {
        confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: colors,
        });
        confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: colors,
        });
    }, 400);
}
