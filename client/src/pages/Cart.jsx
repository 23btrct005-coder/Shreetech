import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, CreditCard, Home } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const { user, profile } = useAuth();
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (checkoutStep === 1) {
      setCheckoutStep(2);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/orders', {
        items: cart,
        total_amount: cartTotal,
        address,
        payment_method: paymentMethod
      }, {
        headers: {
          Authorization: `Bearer ${user.id}` // In real app, send actual session token
        }
      });
      
      clearCart();
      alert('Order placed successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Error placing order:', err);
      alert('Failed to place order. Ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-8">
          <ShoppingBag className="text-slate-300" size={48} />
        </div>
        <h2 className="text-3xl font-bold text-primary mb-4">Your cart is empty</h2>
        <p className="text-slate-500 mb-8 max-w-sm">Looks like you haven't added any industrial solutions to your cart yet.</p>
        <Link to="/catalog" className="btn-primary py-4 px-8 text-lg font-bold">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 px-6 md:px-12 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12">
        
        {/* Left Side: Cart Items or Checkout Form */}
        <div className="flex-grow">
          {checkoutStep === 1 ? (
            <div className="space-y-6">
              <h1 className="text-3xl font-extrabold text-primary mb-8">Shopping Cart</h1>
              {cart.map(item => (
                <div key={item.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center gap-6 group hover:shadow-md transition-all">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                    <img src={item.image_url || '/placeholder_p.png'} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow text-center sm:text-left">
                    <h3 className="font-bold text-lg text-primary">{item.name}</h3>
                    <p className="text-slate-500 text-sm mb-2">{item.category}</p>
                    <p className="text-secondary font-extrabold">₹{parseFloat(item.price).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:text-secondary transition-colors"><Minus size={18} /></button>
                    <span className="font-bold w-8 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:text-secondary transition-colors"><Plus size={18} /></button>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 size={22} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-lg animate-fade-in">
              <h2 className="text-3xl font-extrabold text-primary mb-8">Delivery Details</h2>
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                    <Home size={18} className="text-accent" /> Shipping Address
                  </label>
                  <textarea 
                    rows="3" 
                    required
                    className="w-full px-6 py-4 bg-slate-50 rounded-2xl border border-slate-200 focus:border-secondary outline-none transition-all"
                    placeholder="Enter your full business or delivery address..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                    <CreditCard size={18} className="text-accent" /> Payment Method
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button 
                      onClick={() => setPaymentMethod('COD')}
                      className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between font-bold ${paymentMethod === 'COD' ? 'border-secondary bg-secondary/5 text-secondary' : 'border-slate-100 text-slate-500 hover:border-slate-200'}`}
                    >
                      Cash on Delivery
                      {paymentMethod === 'COD' && <div className="w-3 h-3 bg-secondary rounded-full"></div>}
                    </button>
                    <button 
                      onClick={() => setPaymentMethod('ONLINE')}
                      className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between font-bold ${paymentMethod === 'ONLINE' ? 'border-secondary bg-secondary/5 text-secondary' : 'border-slate-100 text-slate-500 hover:border-slate-200'}`}
                    >
                      Credit/Debit Card (Mock)
                      {paymentMethod === 'ONLINE' && <div className="w-3 h-3 bg-secondary rounded-full"></div>}
                    </button>
                  </div>
                </div>
                
                <button 
                  onClick={() => setCheckoutStep(1)}
                  className="text-secondary font-bold text-sm hover:underline"
                >
                  ← Back to cart
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Order Summary */}
        <div className="w-full lg:w-[380px] shrink-0">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-lg sticky top-24">
            <h2 className="text-xl font-bold text-primary mb-6">Order Summary</h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal ({cart.length} items)</span>
                <span>₹{cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Shipping</span>
                <span className="text-green-600 font-bold uppercase text-xs">Free</span>
              </div>
              <div className="h-px bg-slate-100 my-4"></div>
              <div className="flex justify-between text-2xl font-extrabold text-primary">
                <span>Total</span>
                <span>₹{cartTotal.toLocaleString()}</span>
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={loading || (checkoutStep === 2 && !address)}
              className={`w-full py-4 text-lg font-bold rounded-2xl transition-all flex items-center justify-center gap-2 group ${loading || (checkoutStep === 2 && !address) ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary-dark shadow-xl shadow-primary/10'}`}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
              ) : (
                <>
                  {checkoutStep === 1 ? 'Proceed to Checkout' : 'Place Order'}
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            <p className="text-center text-[10px] text-slate-400 mt-4 leading-relaxed">
              By placing your order, you agree to Shree Tech's industrial supply terms and conditions.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Cart;
