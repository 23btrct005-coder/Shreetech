import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, ArrowRight, Home, ShoppingBag } from 'lucide-react';
import { supabase } from '../supabase';

const OrderSuccess = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*, order_items(*, products(*))')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        setOrder(data);
      } catch (err) {
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  return (
    <div className="py-20 px-6 md:px-12 bg-slate-50 min-h-screen flex items-center justify-center">
      <div className="max-w-3xl w-full">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 md:p-16 rounded-[3rem] shadow-2xl border border-slate-100 text-center relative overflow-hidden"
        >
          {/* Decorative background accent */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-secondary/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-10 shadow-xl shadow-green-500/20"
            >
              <CheckCircle size={48} />
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-6">Order Placed!</h1>
            <p className="text-xl text-slate-500 mb-12 max-w-lg mx-auto leading-relaxed">
              Thank you for choosing Shree Tech Rubber Products. Your industrial solutions are being prepared for delivery.
            </p>

            {loading ? (
              <div className="h-20 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-4 border-secondary border-t-transparent"></div></div>
            ) : order ? (
              <div className="bg-slate-50 rounded-3xl p-8 mb-12 border border-slate-100 text-left">
                <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-200">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Order Number</p>
                    <p className="text-lg font-bold text-primary">{order.id.slice(0, 8).toUpperCase()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Amount</p>
                    <p className="text-lg font-bold text-secondary">₹{parseFloat(order.total_amount).toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Package className="text-accent shrink-0 mt-1" size={20} />
                    <div>
                      <p className="text-sm font-bold text-primary">Items Selected</p>
                      <p className="text-sm text-slate-500 italic">
                        {order.order_items.map(i => i.products?.name).join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/catalog" 
                className="btn-primary py-5 px-10 rounded-2xl text-lg font-bold flex items-center justify-center gap-3 transition-all hover:gap-4 shadow-xl shadow-primary/10"
              >
                Continue Shopping <ShoppingBag size={22} />
              </Link>
              <Link 
                to="/dashboard" 
                className="btn-outline py-5 px-10 rounded-2xl text-lg font-bold flex items-center justify-center gap-3 border-2 border-slate-200 hover:border-primary transition-all"
              >
                View My Orders <ArrowRight size={22} />
              </Link>
            </div>
            
            <p className="mt-12 text-slate-400 text-sm flex items-center justify-center gap-2">
              <Home size={16} /> Need help? Call +91 94265 68840
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderSuccess;
