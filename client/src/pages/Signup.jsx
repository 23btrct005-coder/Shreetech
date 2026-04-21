import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Phone, Loader2, AlertCircle, ArrowRight } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      return setError('Passwords do not match');
    }
    setLoading(true);
    setError('');
    try {
      await signup(formData.email, formData.password, { 
        full_name: formData.full_name, 
        phone: formData.phone 
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-slate-50 px-6 py-12">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-extrabold text-primary mb-2">Create Account</h1>
              <p className="text-slate-500">Join Shree Tech for industrial quality roller solutions.</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm">
                <AlertCircle size={20} />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-secondary" size={20} />
                    <input 
                      name="full_name"
                      type="text" 
                      required
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-xl border border-slate-200 focus:border-secondary transition-all outline-none"
                      placeholder="John Doe"
                      value={formData.full_name}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-secondary" size={20} />
                    <input 
                      name="phone"
                      type="tel" 
                      required
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-xl border border-slate-200 focus:border-secondary transition-all outline-none"
                      placeholder="+91 XXXXX XXXXX"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-secondary" size={20} />
                  <input 
                    name="email"
                    type="email" 
                    required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-xl border border-slate-200 focus:border-secondary transition-all outline-none"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-secondary" size={20} />
                    <input 
                      name="password"
                      type="password" 
                      required
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-xl border border-slate-200 focus:border-secondary transition-all outline-none"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Confirm Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-secondary" size={20} />
                    <input 
                      name="confirm_password"
                      type="password" 
                      required
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-xl border border-slate-200 focus:border-secondary transition-all outline-none"
                      placeholder="••••••••"
                      value={formData.confirm_password}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary w-full py-4 text-lg font-bold flex items-center justify-center gap-2 group mt-4"
              >
                {loading ? <Loader2 className="animate-spin" /> : (
                  <>
                    Create Account <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="bg-slate-50 p-8 text-center border-t border-slate-100">
            <p className="text-slate-500">
              Already have an account? {' '}
              <Link to="/login" className="text-secondary font-bold hover:underline">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
