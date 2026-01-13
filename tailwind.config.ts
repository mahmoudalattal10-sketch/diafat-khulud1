import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: 'class',
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Brand Colors - Swapped: Primary is now Gold, Secondary is now Green
                primary: {
                    50: '#fdf8e8',
                    100: '#f9edc6',
                    200: '#f5e1a1',
                    300: '#f0d47b',
                    400: '#ecca5e',
                    500: '#C9A227', // Main Gold (Primary)
                    600: '#b59322',
                    700: '#9e7f1d',
                    800: '#866b18',
                    900: '#5c4a11',
                },
                secondary: {
                    50: '#e8f5ec',
                    100: '#c6e6d0',
                    200: '#a1d5b1',
                    300: '#7bc492',
                    400: '#5eb77a',
                    500: '#1B5E3A', // Main Green (Secondary)
                    600: '#185534',
                    700: '#134a2c',
                    800: '#0f3e24',
                    900: '#0a2e1a',
                },
                background: '#FFFFFF',
                foreground: '#1a1a1a',
            },
            fontFamily: {
                cairo: ['Cairo', 'sans-serif'],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'hero-gradient': 'linear-gradient(135deg, rgba(201, 162, 39, 0.9) 0%, rgba(201, 162, 39, 0.7) 100%)',
            },
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                'card': '0 4px 20px rgba(0, 0, 0, 0.08)',
                'card-hover': '0 8px 30px rgba(0, 0, 0, 0.12)',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.6s ease-out',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
        },
    },
    plugins: [],
};

export default config;
