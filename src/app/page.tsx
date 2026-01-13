import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';

const DestinationsSection = dynamic(() => import('@/components/DestinationsSection'));
const BestHotelsSection = dynamic(() => import('@/components/BestHotelsSection'));
const ReviewsSection = dynamic(() => import('@/components/ReviewsSection'));
const Footer = dynamic(() => import('@/components/Footer'));

export default function Home() {
    return (
        <main className="min-h-screen">
            <Header />
            <HeroSection />
            <DestinationsSection />
            <BestHotelsSection />
            <ReviewsSection />
            <Footer />
        </main>
    );
}
