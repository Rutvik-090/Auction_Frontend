import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-8 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="w-32 h-32 bg-surface-container rounded-full flex items-center justify-center mb-8 shadow-inner relative overflow-hidden group">
         <div className="absolute inset-0 bg-primary/10 transition-colors group-hover:bg-primary/20"></div>
         <span className="material-symbols-outlined text-6xl text-primary relative z-10">explore_off</span>
      </div>
      <h1 className="text-8xl font-black headline text-on-surface tracking-tighter mb-4 opacity-90 drop-shadow-sm">404</h1>
      <h2 className="text-3xl font-bold headline text-on-surface mb-6">Lost in the Archives</h2>
      <p className="text-on-surface-variant font-body max-w-md mx-auto mb-10 text-lg">
        The masterpiece or specific auction listing you are searching for has been relocated, closed, or never existed in our collection.
      </p>
      <Link 
        to="/" 
        className="bg-gradient-to-r from-primary to-primary-container text-white px-10 py-4 rounded-full font-bold text-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] transition-all flex items-center gap-3"
      >
        <span className="material-symbols-outlined text-xl">home</span>
        Return to Gallery
      </Link>
    </div>
  );
};

export default NotFound;
