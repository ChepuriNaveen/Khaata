import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col transition-colors duration-200">
      <Navbar />
      <main className="flex-grow p-4 md:p-6 max-w-7xl mx-auto w-full">
        {children}
      </main>
      <footer className="py-4 text-center text-sm text-muted-foreground border-t border-border">
        <div className="max-w-7xl mx-auto px-4">
          <p>© {new Date().getFullYear()} CrediKhaata. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;