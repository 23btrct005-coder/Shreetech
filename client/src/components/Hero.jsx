import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-primary">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/shree_tech_hero.png" 
          alt="Industrial Rubber Rollers" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent"></div>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-secondary-light font-bold track-widest uppercase text-sm mb-4 block">
              Established 1996
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
              Precision Engineered <span className="text-secondary-light">Rubber Rollers</span> for Global Industry
            </h1>
            <p className="text-xl text-slate-300 mb-10 leading-relaxed max-w-2xl">
              Shree Tech Rubber Products provides state-of-the-art rolling solutions across 
              printing, textile, steel, and paper industries with 25+ years of manufacturing excellence.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <Link to="/catalog" className="btn-primary py-4 px-8 text-lg flex items-center gap-2 group">
                Explore Catalog <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#about" className="btn-outline border-white text-white hover:bg-white hover:text-primary py-4 px-8 text-lg">
                About Our Process
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="text-secondary-light" size={20} />
                <span>Custom Polymer Formulations</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="text-secondary-light" size={20} />
                <span>Up to 800mm Diameter Capacity</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="text-secondary-light" size={20} />
                <span>Speciality Silicone Solutions</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="text-secondary-light" size={20} />
                <span>In-house Fabrication Excellence</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Animated Elements */}
      <motion.div 
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[-10%] top-[20%] w-[40%] aspect-square rounded-full border-[40px] border-secondary/10 hidden lg:block"
      />
    </section>
  );
};

export default Hero;
