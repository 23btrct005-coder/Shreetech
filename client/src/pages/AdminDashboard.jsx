import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase';
import { LayoutDashboard, Package, Users, ShoppingBag, TrendingUp, Plus, Edit2, Trash2, Check, X, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    image_url: '',
    availability: true
  });
  const [expandedOrder, setExpandedOrder] = useState(null);

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
        supabase.from('orders').select('*, profiles(full_name, email), order_items(*, products(*))').order('created_at', { ascending: false }),
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

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { id, created_at, ...updateData } = productForm;
      
      if (editingProduct) {
        const { error } = await supabase.from('products').update(updateData).eq('id', editingProduct.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').insert([updateData]);
        if (error) throw error;
      }
      setShowProductModal(false);
      setEditingProduct(null);
      setProductForm({ name: '', category: '', price: '', description: '', image_url: '', availability: true });
      fetchData();
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setProductForm({ ...product });
    setShowProductModal(true);
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
                  <button 
                    onClick={() => { setEditingProduct(null); setProductForm({ name: '', category: '', price: '', description: '', image_url: '', availability: true }); setShowProductModal(true); }}
                    className="btn-primary py-3 flex items-center gap-2"
                  >
                    <Plus size={20} /> Add Product
                  </button>
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
                              <button onClick={() => openEditModal(p)} className="p-2 hover:bg-blue-50 text-blue-500 rounded-lg"><Edit2 size={18} /></button>
                              <button onClick={() => deleteProduct(p.id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg"><Trash2 size={18} /></button>
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
                        <React.Fragment key={o.id}>
                          <tr className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-8 py-6 font-mono text-xs cursor-pointer text-secondary hover:underline" onClick={() => setExpandedOrder(expandedOrder === o.id ? null : o.id)}>
                              {o.id.slice(0, 8)}
                            </td>
                            <td className="px-8 py-6 font-bold text-primary">{o.profiles?.full_name}</td>
                            <td className="px-8 py-6 font-bold text-secondary">₹{parseFloat(o.total_amount).toLocaleString()}</td>
                            <td className="px-8 py-6 uppercase tracking-widest text-[10px]">
                              <span className={`px-3 py-1 rounded-full font-bold ${o.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
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
                          {expandedOrder === o.id && (
                            <tr className="bg-slate-50/30">
                              <td colSpan="5" className="px-12 py-8">
                                <div className="space-y-4">
                                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Order Items</h4>
                                  {o.order_items?.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-sm border-b border-white pb-3">
                                      <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-white flex items-center justify-center p-1 border border-slate-100">
                                          <img src={item.products?.image_url} className="w-full h-full object-contain" />
                                        </div>
                                        <span className="font-bold text-primary">{item.products?.name}</span>
                                      </div>
                                      <div className="flex gap-8">
                                        <span className="text-slate-400">Qty: {item.quantity}</span>
                                        <span className="font-bold">₹{item.price.toLocaleString()}</span>
                                      </div>
                                    </div>
                                  ))}
                                  <div className="pt-4 text-xs text-slate-400">
                                    <p className="font-bold mb-1 uppercase tracking-widest">Address</p>
                                    <p>{o.address}</p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
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

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl border border-slate-100 overflow-hidden"
          >
            <div className="bg-slate-50 p-8 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-2xl font-black text-primary">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button 
                onClick={() => setShowProductModal(false)}
                className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors shadow-sm"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleProductSubmit} className="p-10 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Product Name</label>
                  <input 
                    required
                    className="w-full px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:border-secondary outline-none transition-all"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="e.g. Industrial Oil Seal"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Category</label>
                  <select 
                    required
                    className="w-full px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:border-secondary outline-none transition-all cursor-pointer"
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  >
                    <option value="">Select Industry</option>
                    <option value="Printing Industry">Printing Industry</option>
                    <option value="Automobile Industry">Automobile Industry</option>
                    <option value="Infrastructure & Construction">Infrastructure & Construction</option>
                    <option value="Textile Industry">Textile Industry</option>
                    <option value="Paper Mill">Paper Mill</option>
                    <option value="General Engineering">General Engineering</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Price (₹)</label>
                  <input 
                    required
                    type="number"
                    className="w-full px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:border-secondary outline-none transition-all"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="25000"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Availability</label>
                  <div className="flex gap-4 p-2 bg-slate-50 rounded-2xl">
                    <button 
                      type="button"
                      onClick={() => setProductForm({ ...productForm, availability: true })}
                      className={`flex-grow py-3 rounded-xl font-bold transition-all ${productForm.availability ? 'bg-green-500 text-white shadow-lg' : 'text-slate-400'}`}
                    >
                      In Stock
                    </button>
                    <button 
                      type="button"
                      onClick={() => setProductForm({ ...productForm, availability: false })}
                      className={`flex-grow py-3 rounded-xl font-bold transition-all ${!productForm.availability ? 'bg-red-500 text-white shadow-lg' : 'text-slate-400'}`}
                    >
                      Out of Stock
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Description</label>
                <textarea 
                  required
                  rows="3"
                  className="w-full px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:border-secondary outline-none transition-all"
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Technical specifications and material details..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Image URL</label>
                <input 
                  className="w-full px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:border-secondary outline-none transition-all"
                  value={productForm.image_url}
                  onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                  placeholder="https://example.com/item.jpg"
                />
              </div>

              <div className="flex gap-4 pt-6">
                <button 
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="flex-grow py-5 bg-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="flex-grow py-5 bg-primary text-white font-black rounded-2xl hover:scale-[1.02] transition-all shadow-xl shadow-primary/20"
                >
                  {loading ? <Loader2 className="animate-spin mx-auto" /> : (editingProduct ? 'Save Changes' : 'Create Product')}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
