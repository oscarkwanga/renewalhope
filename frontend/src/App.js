import { useEffect,useState } from 'react';
import { NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { FaBars, FaTimes } from "react-icons/fa";
import './theme.css';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import Signin from './pages/SigninPage';
import logo from './assets/deliverance icon.jpg';


const navItems = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/ministries', label: 'Ministries' },
  { to: '/sermons', label: 'Sermons' },
  { to: '/news', label: 'News' },
  { to: '/contact', label: 'Contact' },
  {to:'/construction',label:'Construction'},


];

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return null;
}

function App() {

  const [menuOpen, setMenuOpen] = useState(false);

const location = useLocation();

useEffect(() => {
    setMenuOpen(false);
}, [location.pathname]);



  return (
    <div className="app-shell">
      <ScrollToTop />
      <header className="site-header">
      </header>

      <main className="page-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<Signin/>} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

   
    </div>
  );
}

export default App;




