import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Package, MapPin, Phone, User as UserIcon, Calendar, Clock, ChevronRight } from 'lucide-react';
import { supabase } from '../supabase';

const UserDashboard = () => {
  const { profile, user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
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
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
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

  return (
    <div className="py-12 px-6 md:px-12 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Profile Sidebar */}
          <div className="col-span-1">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-lg sticky top-24">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center text-3xl font-bold mb-4 shadow-xl shadow-primary/20">
                  {profile?.full_name?.charAt(0)}
                </div>
                <h2 className="text-2xl font-bold text-primary">{profile?.full_name}</h2>
                <p className="text-slate-500 text-sm uppercase tracking-wider font-bold mt-1">{profile?.role}</p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4 text-slate-600">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center shrink-0"><UserIcon size={18} /></div>
                  <div className="text-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase">Account Email</p>
                    <p className="font-medium truncate">{profile?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-slate-600">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center shrink-0"><Phone size={18} /></div>
                  <div className="text-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase">Contact Number</p>
                    <p className="font-medium">{profile?.phone || 'Not provided'}</p>
                  </div>
                </div>
                <Link to="/settings" className="btn-outline w-full py-3 text-sm font-bold flex items-center justify-center gap-2 mt-4">
                  Account Settings
                </Link>
              </div>
            </div>
          </div>

          {/* Order History */}
          <div className="col-span-1 lg:col-span-2">
            <h2 className="text-3xl font-extrabold text-primary mb-8 flex items-center gap-3">
              <Package className="text-secondary" /> Order History
            </h2>

            {loading ? (
              <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-4 border-secondary border-t-transparent"></div></div>
            ) : orders.length > 0 ? (
              <div className="space-y-6">
                {orders.map(order => (
                  <div key={order.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all group">
                    <div className="p-6 border-b border-slate-50 flex flex-wrap justify-between items-center gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center"><Clock size={22} className="text-slate-400" /></div>
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase">Order ID: {order.id.slice(0, 8)}</p>
                          <p className="font-bold text-primary">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        </div>
                      </div>
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex flex-col sm:flex-row justify-between gap-6">
                        <div className="space-y-4 flex-grow">
                          {order.order_items.map((item, i) => (
                            <div key={i} className="flex items-center gap-4">
                              <img src={item.products?.image_url || '/placeholder_p.png'} className="w-10 h-10 rounded-lg object-cover" />
                              <div className="text-sm">
                                <p className="font-bold text-slate-700">{item.products?.name}</p>
                                <p className="text-slate-500">Qty: {item.quantity} × ₹{parseFloat(item.price).toLocaleString()}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="text-right sm:border-l sm:pl-8 flex flex-col justify-end">
                          <p className="text-xs font-bold text-slate-400 uppercase mb-1">Total Amount</p>
                          <p className="text-2xl font-extrabold text-secondary">₹{parseFloat(order.total_amount).toLocaleString()}</p>
                          <Link 
                            to={`/order/${order.id}`}
                            className="text-secondary font-bold text-sm mt-3 flex items-center justify-end gap-1 group-hover:gap-2 transition-all hover:underline"
                          >
                            View Details <ChevronRight size={16} />
                          </Link>

                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-16 rounded-3xl text-center border border-dashed border-slate-200">
                <Package className="mx-auto text-slate-200 mb-6" size={48} />
                <h3 className="text-xl font-bold text-slate-400">No orders Found</h3>
                <p className="text-slate-500 mt-2">You haven't placed any orders yet.</p>
                <Link to="/catalog" className="text-secondary font-bold mt-4 inline-block hover:underline">Go to Shop</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
import { Link } from 'react-router-dom';
