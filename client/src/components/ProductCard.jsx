import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={product.image_url || '/placeholder_p.png'} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <Link to={`/product/${product.id}`} className="p-3 bg-white text-primary rounded-full hover:bg-secondary hover:text-white transition-colors shadow-lg">
            <Eye size={20} />
          </Link>
          <button 
            onClick={() => addToCart(product)}
            className="p-3 bg-white text-primary rounded-full hover:bg-accent hover:text-white transition-colors shadow-lg"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-sm text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
            {product.category}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-bold text-primary mb-2 line-clamp-1">{product.name}</h3>
        <p className="text-sm text-slate-500 mb-6 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-extrabold text-secondary">
            ₹{parseFloat(product.price).toLocaleString()}
          </span>
          <button 
            onClick={() => addToCart(product)}
            className="text-primary hover:text-secondary font-bold text-sm flex items-center gap-1 group/btn"
          >
            Add to Cart
            <ShoppingCart size={16} className="group-hover/btn:translate-y-[-2px] transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
