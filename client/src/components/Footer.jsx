import React from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-white pt-16 pb-8 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Company Info */}
        <div className="col-span-1 md:col-span-1">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="bg-white text-primary p-1 rounded">ST</span>
            Shree Tech
          </h3>
          <p className="text-slate-400 mb-6 leading-relaxed">
            Leading manufacturer of high-quality industrial rubber rollers since 1996. Committed to precision and excellence.
          </p>
          <div className="flex gap-4">
            <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-secondary transition-colors"><Facebook size={18} /></a>
            <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-secondary transition-colors"><Instagram size={18} /></a>
            <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-secondary transition-colors"><Linkedin size={18} /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
          <ul className="flex flex-col gap-4 text-slate-400">
            <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
            <li><a href="/catalog" className="hover:text-white transition-colors">Products</a></li>
            <li><a href="/#about" className="hover:text-white transition-colors">About Us</a></li>
            <li><a href="/#contact" className="hover:text-white transition-colors">Contact</a></li>
          </ul>
        </div>

        {/* Industries */}
        <div>
          <h4 className="text-lg font-semibold mb-6">Industries</h4>
          <ul className="flex flex-col gap-4 text-slate-400">
            <li>Printing Industry</li>
            <li>Paper & Paperboard</li>
            <li>Steel & Metal Coating</li>
            <li>Textile Processing</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-lg font-semibold mb-6">Contact Us</h4>
          <ul className="flex flex-col gap-4 text-slate-400">
            <li className="flex items-start gap-3">
              <MapPin size={20} className="text-accent shrink-0" />
              <span>41/2, 1st Floor, Thigalarapalya Main Rd, Peenya IIIrd Stage, Bangalore - 560058</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={20} className="text-accent shrink-0" />
              <span>+91 94484 92422</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={20} className="text-accent shrink-0" />
              <span>shreetechbv@gmail.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-slate-800 mt-16 pt-8 text-center text-slate-500 text-sm">
        <p>© {new Date().getFullYear()} Shree Tech Rubber Products. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
