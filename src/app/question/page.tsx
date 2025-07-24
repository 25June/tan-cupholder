import { Faq } from '@/components/faq/Faq';
import Footer from '@/components/footer/Footer';
import StaticMenuBar from '@/components/menu-bar/StaticMenuBar';

export default function QuestionPage() {
  return (
    <div>
      <StaticMenuBar />
      <Faq />
      <Footer />
    </div>
  );
}
