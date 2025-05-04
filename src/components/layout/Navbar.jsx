import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  Menu, X, Sun, Moon, LogOut, User, Home, ChevronDown 
} from 'lucide-react';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!currentUser) return null;

  return (
    <header className="bg-card border-b border-border sticky top-0 z-40">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <span className="text-2xl font-bold text-primary">
                  Credi<span className="text-accent">Khaata</span>
                </span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to="/" className="border-transparent text-foreground inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                <Home className="h-4 w-4 mr-1" />
                Dashboard
              </Link>
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            <button
              type="button"
              className="bg-secondary p-1 rounded-full text-foreground hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
              onClick={toggleDarkMode}
            >
              {darkMode ? (
                <Sun className="h-6 w-6" />
              ) : (
                <Moon className="h-6 w-6" />
              )}
            </button>
            
            <div className="relative ml-3">
              <div className="flex items-center">
                <div className="relative group">
                  <button className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary items-center gap-1 p-1 pr-2">
                    <div className="bg-primary text-primary-foreground rounded-full p-1">
                      <User className="h-5 w-5" />
                    </div>
                    <span className="text-foreground">{currentUser.name}</span>
                    <ChevronDown className="h-4 w-4 text-foreground" />
                  </button>
                  
                  <div className="absolute right-0 w-48 mt-2 origin-top-right bg-card rounded-md shadow-lg border border-border invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="py-1 rounded-md bg-card shadow-xs">
                      <div className="block px-4 py-2 text-sm text-foreground border-b border-border">
                        <p className="font-semibold">{currentUser.name}</p>
                        <p className="text-muted-foreground">{currentUser.shopName}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="flex w-full px-4 py-2 text-sm text-foreground hover:bg-secondary items-center"
                      >
                        <LogOut className="h-4 w-4 mr-2" /> Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="p-2 rounded-md text-foreground hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1 border-t border-border">
            <Link
              to="/"
              className="block pl-3 pr-4 py-2 text-base font-medium text-foreground hover:bg-secondary"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Home className="h-4 w-4 mr-1 inline" />
              Dashboard
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-border">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <div className="bg-primary text-primary-foreground rounded-full p-1">
                  <User className="h-5 w-5" />
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-foreground">{currentUser.name}</div>
                <div className="text-sm font-medium text-muted-foreground">{currentUser.shopName}</div>
              </div>
              <button
                className="ml-auto flex-shrink-0 bg-secondary p-1 rounded-full text-foreground hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                onClick={toggleDarkMode}
              >
                {darkMode ? (
                  <Sun className="h-6 w-6" />
                ) : (
                  <Moon className="h-6 w-6" />
                )}
              </button>
            </div>
            <div className="mt-3 space-y-1">
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-base font-medium text-foreground hover:bg-secondary"
              >
                <LogOut className="h-4 w-4 mr-2 inline" /> Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;