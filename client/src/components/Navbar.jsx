import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="glass sticky top-0 z-50 py-4 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-primary flex items-center gap-2">
          <span className="bg-primary text-white p-1 rounded">ST</span>
          <span className="hidden md:inline">Shree Tech</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 font-medium">
          <Link to="/" className="hover:text-secondary transition-colors">Home</Link>
          <Link to="/catalog" className="hover:text-secondary transition-colors">Products</Link>
          {profile?.role === 'admin' && (
            <Link to="/admin" className="text-accent hover:text-accent-dark transition-colors flex items-center gap-1">
              <Settings size={18} /> Admin
            </Link>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative p-2 hover:bg-slate-100 rounded-full transition-all">
            <ShoppingCart size={22} className="text-primary" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/dashboard" className="flex items-center gap-2 hover:text-secondary font-medium">
                <User size={22} className="text-primary" />
                <span className="hidden sm:inline">{profile?.full_name?.split(' ')[0]}</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="p-2 hover:bg-red-50 text-red-500 rounded-full transition-all"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary">Login</Link>
          )}

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-t p-6 flex flex-col gap-4 shadow-lg animate-fade-in">
          <Link to="/" onClick={() => setIsOpen(false)} className="hover:text-secondary font-medium">Home</Link>
          <Link to="/catalog" onClick={() => setIsOpen(false)} className="hover:text-secondary font-medium">Products</Link>
          {profile?.role === 'admin' && (
            <Link to="/admin" onClick={() => setIsOpen(false)} className="text-accent font-medium">Admin Panel</Link>
          )}
          {!user && (
            <Link to="/login" onClick={() => setIsOpen(false)} className="btn-primary text-center">Login</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
