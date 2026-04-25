import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { useCart } from '../context/CartContext';
import { 
  ShoppingCart, 
  ArrowLeft, 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  Loader2,
  CheckCircle2,
  Package,
  Layers,
  Thermometer,
  ExternalLink
} from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState('overview');

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
      if (data.category) {
        fetchRelatedProducts(data.category, data.id);
      }
    } catch (err) {
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async (category, excludeId) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .neq('id', excludeId)
        .limit(4);
      
      if (error) throw error;
      setRelatedProducts(data || []);
    } catch (err) {
      console.error('Error fetching related products:', err);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    // Visual feedback could be added here
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="animate-spin text-secondary mb-4" size={48} />
      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Spec...</p>
    </div>
  );

  if (!product) return (
    <div className="h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-50">
      <Package className="text-slate-200 mb-6" size={80} />
      <h2 className="text-3xl font-bold text-primary mb-4">Product not found</h2>
      <Link to="/catalog" className="btn-primary">Back to Catalog</Link>
    </div>
  );

  return (
    <div className="bg-white min-h-screen">
      <div className="py-12 px-6 md:px-12 max-w-7xl mx-auto">
        
        {/* Breadcrumb / Back */}
        <Link to="/catalog" className="inline-flex items-center gap-2 text-slate-400 hover:text-secondary font-bold mb-12 transition-all group">
          <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center group-hover:border-secondary transition-colors">
            <ArrowLeft size={18} /> 
          </div>
          Back to Catalog
        </Link>

        {/* Hero Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start mb-24">
          
          {/* Left: Interactive Image Gallery */}
          <div className="space-y-6">
            <div 
              
              
              className="rounded-[3rem] overflow-hidden shadow-2xl border border-slate-50 bg-slate-50 aspect-square group relative"
            >
              <img 
                src={product.image_url || '/placeholder_p.png'} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              
              {!product.availability && (
                <div className="absolute top-8 right-8 bg-red-600 text-white px-6 py-2 rounded-full font-bold text-sm shadow-xl">
                  OUT OF STOCK
                </div>
              )}
            </div>
            
            {/* Features Icons */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Thermometer, text: "High Heat Resistant" },
                { icon: Layers, text: "Multi-Coat Bond" },
                { icon: ShieldCheck, text: "Industrial Quality" }
              ].map((feat, i) => (
                <div key={i} className="p-4 bg-slate-50 rounded-2xl flex flex-col items-center text-center gap-2 border border-slate-100">
                  <feat.icon className="text-secondary" size={20} />
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-tighter">{feat.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Product Details & Purchase */}
          <div
            
            
            className="flex flex-col"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="px-4 py-1 bg-accent/10 text-accent text-[10px] font-black uppercase tracking-widest rounded-full">{product.category}</span>
              <div className="flex items-center gap-1 text-green-500 font-bold text-xs">
                <CheckCircle2 size={14} /> Verified Quality
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold text-primary mb-8 leading-[1.1] tracking-tight">
              {product.name}
            </h1>
            
            <p className="text-xl text-slate-500 mb-10 leading-relaxed font-medium italic">
              "{product.description}"
            </p>

            <div className="flex items-baseline gap-6 mb-12">
              <span className="text-5xl font-black text-secondary tracking-tighter">₹{parseFloat(product.price).toLocaleString()}</span>
              <span className="text-slate-400 text-sm font-medium">Excl. GST & Shipping</span>
            </div>

            {/* Tabs for more info */}
            <div className="mb-10 space-y-6">
              <div className="flex gap-8 border-b border-slate-100">
                {['overview', 'specifications'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 text-sm font-black uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-primary' : 'text-slate-300'}`}
                  >
                    {tab}
                    {activeTab === tab && <div  className="absolute bottom-0 left-0 right-0 h-1 bg-secondary rounded-full" />}
                  </button>
                ))}
              </div>

              <div className="min-h-[120px]">
                <AnimatePresence mode="wait">
                  {activeTab === 'overview' ? (
                    <div 
                      key="overview"
                      
                      
                      
                      className="text-slate-600 space-y-4"
                    >
                      <p>
                        Our precision-engineered {product.name} is designed for high-end {product.category} applications. 
                        Manufactured with metal-to-rubber bonding technology and fabric reinforcement for superior durability.
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {['Nitrile', 'EPDM', 'HNBR', 'Viton', 'Neoprene', 'Silicon', 'Polyurethane'].map(mat => (
                          <span key={mat} className={`px-3 py-1 border rounded-lg text-xs font-bold transition-colors ${product.description.includes(mat) ? 'bg-secondary/10 border-secondary text-secondary' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                            {mat}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div 
                      key="specs"
                      
                      
                      
                      className="grid grid-cols-2 gap-4"
                    >
                      {[
                        { label: "Industrial Standard", value: product.description.includes('IS 5382') ? "IS 5382 / ISI 7466" : "International Grade" },
                        { label: "Material Composition", value: "Custom Polymer Compound" },
                        { label: "Hardness Range", value: product.name.toLowerCase().includes('roller') ? "15 to 100 Shore A" : "40 to 90 Shore A" },
                        { label: "Bonding Type", value: "Metal-to-Rubber Bonded" },
                        { label: "Reinforcement", value: "High-Tensile Fabric / Metal Core" },
                        { label: "Heat Resistance", value: "Up to 250°C (Material Dependent)" }
                      ].map((spec, i) => (
                        <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{spec.label}</p>
                          <p className="font-bold text-primary text-sm">{spec.value}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Purchase Controls */}
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                  className="w-10 h-10 hover:bg-white rounded-xl flex items-center justify-center transition-all shadow-sm active:scale-95"
                >
                  <RefreshCw className="rotate-180 text-slate-400" size={20} />
                </button>
                <span className="font-black text-2xl w-8 text-center text-primary">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)} 
                  className="w-10 h-10 hover:bg-white rounded-xl flex items-center justify-center transition-all shadow-sm active:scale-95"
                >
                  <ShieldCheck className="rotate-45 text-slate-400" size={20} />
                </button>
              </div>
              <button 
                onClick={handleAddToCart}
                disabled={!product.availability}
                className={`btn-primary py-6 px-12 text-lg font-bold flex-grow sm:flex-grow-0 flex items-center justify-center gap-4 rounded-3xl transition-all shadow-2xl ${product.availability ? 'hover:scale-105 shadow-primary/20' : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'}`}
              >
                <ShoppingCart size={24} /> 
                {product.availability ? 'Add to Logistics' : 'Currently Unavailable'}
              </button>
            </div>
            
            <div className="mt-12 pt-8 border-t border-slate-100 flex items-center gap-8">
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Truck size={18} className="text-accent" />
                Global Export Ready
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <ShieldCheck size={18} className="text-accent" />
                ISO 9001 Certified
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="pt-24 border-t border-slate-50">
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="text-secondary font-black uppercase tracking-widest text-[10px] mb-2 block">The Collection</span>
                <h2 className="text-4xl font-extrabold text-primary">Related Solutions</h2>
              </div>
              <Link to={`/catalog?search=${product.category}`} className="text-sm font-bold text-slate-400 hover:text-primary transition-all flex items-center gap-2">
                View All <ExternalLink size={14} />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((rel, idx) => (
                <div
                  key={rel.id}
                  
                  
                  
                  
                  className="group"
                >
                  <Link to={`/product/${rel.id}`}>
                    <div className="bg-slate-50 rounded-[2.5rem] overflow-hidden aspect-square mb-6 border border-slate-100 relative group-hover:shadow-2xl transition-all duration-700">
                      <img src={rel.image_url || '/placeholder_p.png'} alt={rel.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <h4 className="font-bold text-primary group-hover:text-secondary transition-colors mb-1">{rel.name}</h4>
                    <p className="text-secondary font-black text-sm">₹{parseFloat(rel.price).toLocaleString()}</p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetail;

