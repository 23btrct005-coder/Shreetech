import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { useCart } from '../context/CartContext';
import { ShoppingCart, ArrowLeft, ShieldCheck, Truck, RefreshCw, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      setProduct(data);
    } catch (err) {
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-secondary" size={48} /></div>;
  if (!product) return <div className="h-screen flex flex-col items-center justify-center p-6 text-center"><h2 className="text-2xl font-bold mb-4">Product not found</h2><Link to="/catalog" className="btn-primary">Back to Catalog</Link></div>;

  return (
    <div className="py-12 px-6 md:px-12 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <Link to="/catalog" className="inline-flex items-center gap-2 text-slate-500 hover:text-secondary font-bold mb-12 transition-colors">
          <ArrowLeft size={20} /> Back to Catalog
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Image */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-3xl overflow-hidden shadow-2xl border border-slate-100"
          >
            <img src={product.image_url || '/placeholder_p.png'} alt={product.name} className="w-full h-auto aspect-square object-cover" />
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <span className="text-sm font-bold text-accent uppercase tracking-widest mb-4">{product.category}</span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-6 leading-tight">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-8">
              <span className="text-3xl font-extrabold text-secondary">₹{parseFloat(product.price).toLocaleString()}</span>
              {product.availability ? (
                <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">In Stock</span>
              ) : (
                <span className="bg-red-100 text-red-700 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Out of Stock</span>
              )}
            </div>

            <p className="text-lg text-slate-600 mb-10 leading-relaxed italic">
              {product.description}
            </p>

            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 mb-10">
              <h3 className="font-bold text-primary mb-4">Product Specifications:</h3>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-center gap-3"><ShieldCheck size={18} className="text-secondary" /> Industrial grade polymer formulation</li>
                <li className="flex items-center gap-3"><Truck size={18} className="text-secondary" /> Custom sizes up to 800mm diameter</li>
                <li className="flex items-center gap-3"><RefreshCw size={18} className="text-secondary" /> High heat and chemical resistance</li>
              </ul>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-4 border-2 border-slate-100 p-2 rounded-2xl">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:text-secondary transition-colors"><RefreshCw className="rotate-180" size={20} /></button>
                <span className="font-extrabold text-xl w-8 text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:text-secondary transition-colors"><ShieldCheck className="rotate-45" size={20} /></button>
              </div>
              <button 
                onClick={() => addToCart(product, quantity)}
                className="btn-primary py-5 px-10 text-lg font-bold flex-grow sm:flex-grow-0 flex items-center justify-center gap-3 shadow-xl shadow-primary/20"
              >
                <ShoppingCart size={24} /> Add to Cart
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
