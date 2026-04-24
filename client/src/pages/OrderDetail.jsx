import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../supabase';
import { 
  Package, 
  ArrowLeft, 
  MapPin, 
  CreditCard, 
  Calendar, 
  Clock, 
  ChevronRight,
  Download,
  Phone,
  Mail,
  Truck,
  CheckCircle2
} from 'lucide-react';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  const fetchOrderDetail = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (*)
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      setOrder(data);
    } catch (err) {
      console.error('Error fetching order details:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'shipped': return 'bg-blue-100 text-blue-700';
      case 'delivered': return 'bg-green-100 text-green-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-secondary border-t-transparent"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
        <h2 className="text-2xl font-bold mb-4">Order not found</h2>
        <Link to="/dashboard" className="btn-primary">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="py-12 px-6 md:px-12 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-secondary font-bold mb-8 transition-colors">
          <ArrowLeft size={18} /> Back to My Orders
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-primary mb-2">Order Details</h1>
            <p className="text-slate-500 flex items-center gap-2">
              <Package size={16} /> ID: <span className="font-mono text-xs">{order.id}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:border-secondary hover:text-secondary transition-all shadow-sm">
              <Download size={18} /> Download Invoice
            </button>
          </div>
        </div>

        {/* Status Tracker */}
        <div className="bg-white rounded-[2.5rem] p-10 mb-8 border border-slate-100 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
              <h3 className="text-2xl font-black text-primary uppercase">{order.status}</h3>
            </div>
            <div className="text-md font-bold text-slate-500 flex items-center gap-2">
              <Clock size={16} className="text-accent" /> Estimated Delivery: <span className="text-primary">3-5 Business Days</span>
            </div>
          </div>
          
          <div className="relative pt-10">
            <div className="absolute top-[50%] left-0 w-full h-1 bg-slate-100 -translate-y-1/2"></div>
            <div 
              className="absolute top-[50%] left-0 h-1 bg-secondary -translate-y-1/2 transition-all duration-1000"
              style={{ width: 
                order.status.toLowerCase() === 'pending' ? '12.5%' : 
                order.status.toLowerCase() === 'processing' ? '37.5%' : 
                order.status.toLowerCase() === 'shipped' ? '62.5%' : 
                order.status.toLowerCase() === 'delivered' ? '100%' : '0%' 
              }}
            ></div>
            
            <div className="relative flex justify-between">
              {[
                { label: 'Pending', icon: Clock },
                { label: 'Processing', icon: Package },
                { label: 'Shipped', icon: Truck },
                { label: 'Delivered', icon: CheckCircle2 }
              ].map((step, i) => {
                const steps = ['pending', 'processing', 'shipped', 'delivered'];
                const currentIdx = steps.indexOf(order.status.toLowerCase());
                const isActive = i <= currentIdx;
                const isCurrent = i === currentIdx;
                
                return (
                  <div key={i} className="flex flex-col items-center gap-4 relative z-10">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg ${isActive ? 'bg-secondary text-white scale-110 shadow-secondary/20' : 'bg-white text-slate-300 border border-slate-100'}`}>
                      <step.icon size={20} />
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isActive ? 'text-primary' : 'text-slate-300'}`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
              <h3 className="text-xl font-bold text-primary mb-8 border-b border-slate-50 pb-4">Ordered Items</h3>
              <div className="space-y-8">
                {order.order_items.map((item, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row items-center gap-6 group">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 border border-slate-100 group-hover:scale-105 transition-transform">
                      <img 
                        src={item.products?.image_url || '/placeholder_p.png'} 
                        alt={item.products?.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="flex-grow text-center sm:text-left">
                      <h4 className="font-bold text-lg text-primary">{item.products?.name}</h4>
                      <p className="text-slate-500 text-sm mb-2">{item.products?.category}</p>
                      <div className="flex items-center justify-center sm:justify-start gap-4">
                        <span className="text-sm px-3 py-1 bg-slate-50 rounded-lg font-bold text-slate-400">Qty: {item.quantity}</span>
                        <span className="font-extrabold text-secondary">₹{parseFloat(item.price).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="text-right font-bold text-slate-400 hidden sm:block">
                      ₹{(item.quantity * item.price).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
              <h3 className="text-xl font-bold text-primary mb-6">Delivery Information</h3>
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center shrink-0">
                  <MapPin size={24} className="text-accent" />
                </div>
                <div>
                  <p className="font-bold text-primary mb-2">Shipping Address</p>
                  <p className="text-slate-500 leading-relaxed max-w-md">
                    {order.address}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
            <div className="bg-primary text-white rounded-[2.5rem] p-10 shadow-xl shadow-primary/10">
              <h3 className="text-lg font-bold text-secondary-light mb-6 opacity-80 uppercase tracking-widest text-xs">Summary</h3>
              <div className="space-y-4 mb-8 pb-8 border-b border-white/10">
                <div className="flex justify-between text-slate-300">
                  <span>Subtotal</span>
                  <span>₹{parseFloat(order.total_amount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Shipping</span>
                  <span className="text-secondary-light">Free</span>
                </div>
              </div>
              <div className="flex justify-between items-center text-3xl font-extrabold">
                <span className="text-sm font-medium opacity-60">Total</span>
                <span className="text-secondary-light">₹{parseFloat(order.total_amount).toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center shrink-0"><Calendar size={18} className="text-slate-400" /></div>
                <div className="text-sm">
                  <p className="text-xs font-bold text-slate-400 uppercase">Order Date</p>
                  <p className="font-bold text-primary">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center shrink-0"><CreditCard size={18} className="text-slate-400" /></div>
                <div className="text-sm">
                  <p className="text-xs font-bold text-slate-400 uppercase">Payment Method</p>
                  <p className="font-bold text-primary">{order.payment_method === 'COD' ? 'Cash on Delivery' : 'Online Payment'}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 text-white rounded-[2.5rem] p-8">
              <h4 className="font-bold mb-4">Support</h4>
              <p className="text-xs text-slate-400 mb-6">Need assistance with this order?</p>
              <div className="space-y-3">
                <a href="tel:+919426568840" className="flex items-center gap-2 text-sm text-secondary-light hover:underline font-bold">
                  <Phone size={14} /> +91 94265 68840
                </a>
                <a href="mailto:support@shreetech.com" className="flex items-center gap-2 text-sm text-secondary-light hover:underline font-bold">
                  <Mail size={14} /> support@shreetech.com
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
