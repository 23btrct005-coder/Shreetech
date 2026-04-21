import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase';
import { LayoutDashboard, Package, Users, ShoppingBag, TrendingUp, Plus, Edit2, Trash2, Check, X, Loader2 } from 'lucide-react';

const AdminDashboard = () => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.role === 'admin') {
      fetchData();
    }
  }, [profile]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, orderRes, userRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('orders').select('*, profiles(full_name, email)').order('created_at', { ascending: false }),
        supabase.from('profiles').select('*').order('created_at', { ascending: false })
      ]);

      setProducts(prodRes.data || []);
      setOrders(orderRes.data || []);
      setUsers(userRes.data || []);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
      if (error) throw error;
      fetchData();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const stats = [
    { title: 'Total Revenue', value: `₹${orders.reduce((sum, o) => sum + parseFloat(o.total_amount), 0).toLocaleString()}`, icon: <TrendingUp className="text-green-500" />, color: 'bg-green-50' },
    { title: 'Total Orders', value: orders.length, icon: <ShoppingBag className="text-blue-500" />, color: 'bg-blue-50' },
    { title: 'Total Products', value: products.length, icon: <Package className="text-accent" />, color: 'bg-orange-50' },
    { title: 'Registered Users', value: users.length, icon: <Users className="text-purple-500" />, color: 'bg-purple-50' },
  ];

  if (profile?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div className="max-w-md">
          <X size={64} className="mx-auto text-red-400 mb-6" />
          <h2 className="text-3xl font-bold text-primary mb-4">Access Denied</h2>
          <p className="text-slate-500">You do not have administrative privileges to view this page.</p>
          <button onClick={() => window.history.back()} className="btn-primary mt-8">Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <div className="w-full lg:w-72 bg-white border-r border-slate-100 p-8 flex flex-col gap-8">
        <div>
          <h2 className="text-xl font-extrabold text-primary flex items-center gap-2 mb-8">
            <LayoutDashboard className="text-secondary" /> Admin Console
          </h2>
          <nav className="space-y-2">
            {[
              { id: 'overview', title: 'Overview', icon: <TrendingUp size={20} /> },
              { id: 'products', title: 'Products', icon: <Package size={20} /> },
              { id: 'orders', title: 'Orders', icon: <ShoppingBag size={20} /> },
              { id: 'users', title: 'Users', icon: <Users size={20} /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === tab.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:bg-slate-50 hover:text-primary'}`}
              >
                {tab.icon} {tab.title}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-6 md:p-12 overflow-x-auto">
        {loading ? (
          <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-secondary" size={48} /></div>
        ) : (
          <div className="max-w-6xl mx-auto">
            {activeTab === 'overview' && (
              <div className="animate-fade-in">
                <h1 className="text-3xl font-extrabold text-primary mb-10">Dashboard Overview</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                  {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                      <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center mb-6`}>{stat.icon}</div>
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.title}</p>
                      <p className="text-2xl font-extrabold text-primary">{stat.value}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                  <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
                  <p className="text-slate-500 text-sm">System statistics and logs will appear here in real-time.</p>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="animate-fade-in">
                <div className="flex justify-between items-center mb-10">
                  <h1 className="text-3xl font-extrabold text-primary">Manage Products</h1>
                  <button className="btn-primary py-3 flex items-center gap-2"><Plus size={20} /> Add Product</button>
                </div>
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-400 text-xs font-bold uppercase tracking-widest">
                      <tr>
                        <th className="px-8 py-6">Product</th>
                        <th className="px-8 py-6">Category</th>
                        <th className="px-8 py-6">Price</th>
                        <th className="px-8 py-6">Availability</th>
                        <th className="px-8 py-6">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-600 divide-y divide-slate-50">
                      {products.map(p => (
                        <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-8 py-6 underline-none">
                            <div className="flex items-center gap-4">
                              <img src={p.image_url || '/placeholder_p.png'} className="w-10 h-10 rounded-lg object-cover" />
                              <span className="font-bold text-primary">{p.name}</span>
                            </div>
                          </td>
                          <td className="px-8 py-6">{p.category}</td>
                          <td className="px-8 py-6 font-bold">₹{parseFloat(p.price).toLocaleString()}</td>
                          <td className="px-8 py-6">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${p.availability ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {p.availability ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex gap-2">
                              <button className="p-2 hover:bg-blue-50 text-blue-500 rounded-lg"><Edit2 size={18} /></button>
                              <button className="p-2 hover:bg-red-50 text-red-500 rounded-lg"><Trash2 size={18} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="animate-fade-in">
                <h1 className="text-3xl font-extrabold text-primary mb-10">Customer Orders</h1>
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-400 text-xs font-bold uppercase tracking-widest">
                      <tr>
                        <th className="px-8 py-6">Order ID</th>
                        <th className="px-8 py-6">Customer</th>
                        <th className="px-8 py-6">Total</th>
                        <th className="px-8 py-6">Status</th>
                        <th className="px-8 py-6">Update</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-600 divide-y divide-slate-50">
                      {orders.map(o => (
                        <tr key={o.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-8 py-6 font-mono text-xs">{o.id.slice(0, 8)}</td>
                          <td className="px-8 py-6 font-bold text-primary">{o.profiles?.full_name}</td>
                          <td className="px-8 py-6 font-bold text-secondary">₹{parseFloat(o.total_amount).toLocaleString()}</td>
                          <td className="px-8 py-6">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${o.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                              {o.status}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            <select 
                              className="text-xs font-bold bg-slate-50 border-none outline-none p-2 rounded-lg cursor-pointer"
                              value={o.status}
                              onChange={(e) => updateStatus(o.id, e.target.value)}
                            >
                              <option value="pending">Pending</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
               <div className="animate-fade-in">
                <h1 className="text-3xl font-extrabold text-primary mb-10">User Management</h1>
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-400 text-xs font-bold uppercase tracking-widest">
                      <tr>
                        <th className="px-8 py-6">Name</th>
                        <th className="px-8 py-6">Email</th>
                        <th className="px-8 py-6">Phone</th>
                        <th className="px-8 py-6">Role</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-600 divide-y divide-slate-50">
                      {users.map(u => (
                        <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-8 py-6 font-bold text-primary">{u.full_name}</td>
                          <td className="px-8 py-6">{u.email}</td>
                          <td className="px-8 py-6">{u.phone || 'N/A'}</td>
                          <td className="px-8 py-6 font-bold uppercase text-[10px] tracking-widest text-slate-400">{u.role}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
