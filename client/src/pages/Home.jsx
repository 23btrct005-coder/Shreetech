import React from 'react';
import Hero from '../components/Hero';
import IndustryShowcase from '../components/IndustryShowcase';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Award, Clock, ShieldCheck, Globe } from 'lucide-react';

const testimonials = [
  {
    name: "Rajesh Kumar",
    company: "Standard Printing Press",
    text: "Shree Tech's silicone rollers have significantly improved our print quality. Their technical expertise is unmatched in Bangalore."
  },
  {
    name: "Suresh Menon",
    company: "South India Textiles",
    text: "We've been sourcing our padder rollers from them for over 10 years. Reliability and durability are their strongest pillars."
  },
  {
    name: "John D'Souza",
    company: "Global Paper Mills",
    text: "Exceptional service and quick turnaround. Their custom formulations solved our heat resistance issues perfectly."
  }
];

const Home = () => {
  return (
    <div className="flex flex-col">
      <Hero />
      <IndustryShowcase />

      {/* Why Choose Us */}
      <section className="py-24 px-6 md:px-12 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">Why Choose Us?</h2>
            <div className="w-24 h-1 bg-accent mx-auto mb-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Award className="text-accent" />, title: "25+ Years Experience", text: "Founded in 1996 with a legacy of excellence." },
              { icon: <ShieldCheck className="text-accent" />, title: "Premium Quality", text: "ISO standards and custom polymer testing." },
              { icon: <Globe className="text-accent" />, title: "Global Reach", text: "Serving clients across India and internationally." },
              { icon: <Clock className="text-accent" />, title: "Fast Delivery", text: "Efficient production cycles to minimize downtime." }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 md:px-12 bg-white flex flex-col md:flex-row items-center gap-16 overflow-hidden">
        <div className="w-full md:w-1/2">
          <div className="relative">
            <div className="absolute -left-4 -top-4 w-24 h-24 bg-accent/10 rounded-full -z-1"></div>
            <h2 className="text-4xl font-bold text-primary mb-8">About Shree Tech Rubber Products</h2>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              We are a sister concern company of NEW TECH RUBBER ROLLERS, Hyderabad. Located in the Peenya Industrial Area of Bangalore, we specialize in high-durometer rubber and urethane rollers engineered for demanding industrial processes.
            </p>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Our in-house chemists and mixing capabilities allow us to process proprietary rubber compound formulations tailored to your specific friction, heat, and chemical resistance requirements.
            </p>
            <div className="flex gap-6">
              <div>
                <span className="text-4xl font-bold text-secondary">20+</span>
                <p className="text-slate-500">Years Experience</p>
              </div>
              <div>
                <span className="text-4xl font-bold text-secondary">500+</span>
                <p className="text-slate-500">Clients Served</p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 relative">
          <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
            <img src="/shree_tech_hero.png" alt="About Factory" className="w-full h-[400px] object-cover grayscale hover:grayscale-0 transition-all duration-700" />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-slate-100 rounded-full -z-1 animate-pulse"></div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 md:px-12 bg-primary text-white overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-16">What Our Clients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-sm text-left">
                <p className="text-lg text-slate-300 mb-8 italic">"{t.text}"</p>
                <div>
                  <p className="font-bold">{t.name}</p>
                  <p className="text-sm text-secondary-light">{t.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-4xl font-bold text-primary mb-8">Get In Touch</h2>
            <p className="text-lg text-slate-600 mb-12">
              Have a specific requirement? Our engineering team is ready to help you find the perfect roller solution.
            </p>
            
            <div className="space-y-6">
              {[
                { icon: <MapPin className="text-accent" />, info: "41/2, 1st Floor, Thigalarapalya Main Rd, Peenya IIIrd Stage, Bangalore - 560058" },
                { icon: <Phone className="text-accent" />, info: "+91 94484 92422 / +91 90362 72245" },
                { icon: <Mail className="text-accent" />, info: "shreetechbv@gmail.com" }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <p className="text-lg">{item.info}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 p-10 rounded-3xl border border-slate-100 shadow-xl">
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Name</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-secondary outline-none transition-colors" placeholder="Your Name" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                  <input type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-secondary outline-none transition-colors" placeholder="Your Email" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Subject</label>
                <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-secondary outline-none transition-colors" placeholder="Subject" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Message</label>
                <textarea rows="4" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-secondary outline-none transition-colors" placeholder="How can we help?"></textarea>
              </div>
              <button type="button" className="btn-primary w-full py-4 text-lg font-bold">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
