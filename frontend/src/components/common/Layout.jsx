import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ChatbotWidget from '../chatbot/ChatbotWidget';
import CompareBar from '../property/CompareBar';
import { useProperty } from '../../context/PropertyContext';

export default function Layout() {
  const { compareList } = useProperty();
  const { pathname } = useLocation();
  const hideFooter = ['/dashboard', '/add-listing'].some((p) => pathname.startsWith(p));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      {!hideFooter && <Footer />}
      {compareList.length > 0 && <CompareBar />}
      <ChatbotWidget />
    </div>
  );
}
