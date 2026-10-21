import { Outlet } from 'react-router-dom';
import PublicHeader from './PublicHeader';
import Footer from './Footer';

export default function PublicLayout() {
  return (
    <div className="min-h-screen">
      <PublicHeader />
      <Outlet />
      <Footer />
    </div>
  );
}
