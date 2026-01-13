import { AboutHero, OurOdyssey, ValueMatrix } from '@/components/about/AboutSections';
import { StatsSection } from '@/components/about/AboutSections'; // Using existing or shared components
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
    title: 'من نحن | ضيافة خلود',
    description: 'تعرف على قصة ضيافة خلود، رؤيتنا، وقيمنا في تقديم أرقى سبل الضيافة لضيوف الرحمن في مكة المكرمة والمدينة المنورة.',
};

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-white">
            <Header />
            <AboutHero />
            <OurOdyssey />
            {/* Reusing existing StatsSection logic if needed or creating specialized ones */}
            <ValueMatrix />
            <ValueMatrix />
            <Footer />
        </main>
    );
}
