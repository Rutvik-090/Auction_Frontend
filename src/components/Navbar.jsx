import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  if (['/login', '/register'].includes(location.pathname)) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getLinkClass = (path) => {
    return location.pathname === path 
      ? "text-[#3525cd] dark:text-[#4f46e5] border-b-2 border-[#3525cd] pb-1"
      : "text-slate-500 dark:text-slate-400 hover:text-[#3525cd] transition-all duration-300";
  };

  return (
    <header className="bg-[#faf8ff]/80 dark:bg-slate-950/80 backdrop-blur-xl docked full-width top-0 sticky z-50 shadow-[0_8px_32px_0_rgba(19,27,46,0.06)]">
      <div className="flex justify-between items-center w-full px-8 h-20">
        <div className="flex items-center gap-12">
          <Link to="/" className="text-xl font-black text-[#3525cd] dark:text-[#4f46e5] tracking-tighter headline">
            The Auction Curator
          </Link>
          <div className="hidden md:flex items-center bg-surface-container-low px-4 py-2 rounded-full w-96 group transition-all duration-300 focus-within:ring-2 focus-within:ring-primary/20">
            <span className="material-symbols-outlined text-outline">search</span>
            <input className="bg-transparent border-none focus:ring-0 text-sm w-full font-label outline-none ml-2" placeholder="Search curated collections..." type="text" />
          </div>
        </div>
        
        <nav className="hidden lg:flex items-center gap-8 font-manrope font-bold text-on-surface">
          {user?.role === 'admin' && (
            <Link to="/admin" className={getLinkClass('/admin')}>Admin</Link>
          )}
          <Link to="/browse" className={getLinkClass('/browse')}>Browse</Link>
          <Link to="/create-auction" className={getLinkClass('/create-auction')}>Sell</Link>
          {user && <Link to="/dashboard" className={getLinkClass('/dashboard')}>Dashboard</Link>}
        </nav>

        <div className="flex items-center gap-4">
          {!user ? (
            <div className="flex gap-4 items-center">
              <Link to="/login" className="font-bold text-sm text-slate-500 hover:text-primary">Log In</Link>
              <Link to="/register" className="bg-primary text-white px-5 py-2 rounded-full font-bold text-sm">Register</Link>
            </div>
          ) : (
            <>
              <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 active:scale-95 transform">
                <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-outline-variant/20">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold headline">{user.name}</p>
                  <button onClick={handleLogout} className="text-[10px] uppercase tracking-widest text-on-surface-variant hover:text-error transition-colors">Log Out</button>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold ring-2 ring-primary/10">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
