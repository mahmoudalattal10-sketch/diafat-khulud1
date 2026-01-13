import { ContactHero, ContactMatrix, ContactForm } from '@/components/contact/ContactSections';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
    title: 'تواصل معنا | ضيافة خلود',
    description: 'نحن هنا لخدمتك. تواصل مع فريق ضيافة خلود للحصول على أفضل عروض الفنادق والخدمات السياحية في مكة المكرمة.',
};

export default function ContactPage() {
    return (
        <main className="bg-[#FDFDFD] min-h-screen">
            <Header />
            <ContactHero />
            <ContactMatrix />
            <ContactForm />
            <Footer />
        </main>
    );
}
