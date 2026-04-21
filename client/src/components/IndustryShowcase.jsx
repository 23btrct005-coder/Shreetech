import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Printer, FlaskConical, Scissors, Cog, Truck } from 'lucide-react';

const industries = [
  {
    name: 'Printing Industry',
    icon: <Printer className="text-secondary" size={32} />,
    roles: ['Ink Fountain', 'Ink Oscillator', 'Vibrator', 'Ink Rider', 'Ink Transfer', 'Alcohol Damper']
  },
  {
    name: 'Paper Mill',
    icon: <Layers className="text-secondary" size={32} />,
    roles: ['Back Up', 'Breast Roller', 'Couch Roller', 'M.G. Tuch', 'Drive Roller', 'Guide Roller']
  },
  {
    name: 'Steel & Coil Coating',
    icon: <Cog className="text-secondary" size={32} />,
    roles: ['Accumulator', 'Bridle', 'Chemical Coater', 'Deflector', 'Leveler', 'Oiler', 'Wringer']
  },
  {
    name: 'Textile Industry',
    icon: <Scissors className="text-secondary" size={32} />,
    roles: ['Dip Tank Coater', 'Expander', 'Padder Roller', 'Press Roller', 'Slasher Nip', 'Warper Nip']
  },
  {
    name: 'Vinyl & Plywood',
    icon: <FlaskConical className="text-secondary" size={32} />,
    roles: ['Embossing', 'Coating', 'Glue Spreader', 'Doctor Rollers', 'Sanding', 'Dipping']
  },
  {
    name: 'Tannery & Glass',
    icon: <Truck className="text-secondary" size={32} />,
    roles: ['Buffing', 'Splitting', 'Washing Machine', 'Feed Roller', 'Idler', 'Nip Rollers']
  }
];

const IndustryShowcase = () => {
  return (
    <section className="py-24 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary mb-4">Industries We Serve</h2>
          <div className="w-24 h-1 bg-accent mx-auto mb-6"></div>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Our versatile range of custom-engineered rubber rollers caters to precision-demanding industries worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {industries.map((industry, index) => (
            <motion.div
              key={industry.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-xl hover:shadow-secondary/5 transition-all group"
            >
              <div className="mb-6 p-4 bg-white rounded-xl inline-block shadow-sm group-hover:scale-110 transition-transform">
                {industry.icon}
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">{industry.name}</h3>
              <ul className="grid grid-cols-2 gap-2">
                {industry.roles.map(role => (
                  <li key={role} className="text-sm text-slate-500 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                    {role}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IndustryShowcase;
