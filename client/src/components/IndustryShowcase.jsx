import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const industries = [
  {
    name: 'Printing Industry',
    imageUrl: 'https://shreerubbtech.com/img/portfolio/item3.jpg',
    roles: ['Ink Fountain Roller', 'Ink Oscillator Roller', 'Vibrator Roller', 'Ink Rider Roller', 'Ink Transfer Roller', 'Alcohol Damper Roller']
  },
  {
    name: 'Automobile Industry',
    imageUrl: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=800',
    roles: ['Oil Seals', 'O-Rings', 'Bellows', 'Dust Covers', 'Engine Mounts', 'Gaskets']
  },
  {
    name: 'Infrastructure & Construction',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=800',
    roles: ['AV Mountings', 'Bridge Bearings', 'Expansion Joints', 'D-Fenders', 'Water Stops', 'Pads']
  },
  {
    name: 'Textile Industry',
    imageUrl: 'https://shreerubbtech.com/img/portfolio/item5.jpg',
    roles: ['Padder Roller', 'Expander Roller', 'Press Roller', 'Slasher Nip Roller', 'Warper Nip Roller', 'Dip Tank Coater']
  },
  {
    name: 'Paper Mill',
    imageUrl: 'https://shreerubbtech.com/img/portfolio/item2.jpg',
    roles: ['Breast Roller', 'Couch Roller', 'M.G. Tuch Roller', 'Drive Roller', 'Guide Roller', 'Back Up Roller']
  },
  {
    name: 'General Engineering',
    imageUrl: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&q=80&w=800',
    roles: ['Coupling Elements', 'Diaphragms', 'Silent Block Bushes', 'Rubber Buckets', 'Star Couplers', 'Spider Couplers']
  }
];


const IndustryShowcase = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary mb-4">Industries We Serve</h2>
          <div className="w-24 h-1 bg-accent mx-auto mb-6"></div>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Click on any product to see technical specifications and engineered details.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {industries.map((industry, index) => (
            <div
              key={industry.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 rounded-3xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-2xl hover:shadow-primary/5 transition-all group overflow-hidden flex flex-col"
            >
              <div 
                className="mb-8 rounded-2xl overflow-hidden shadow-lg h-48 cursor-pointer relative shrink-0"
                onClick={() => navigate(`/catalog?category=${industry.name}`)}
              >
                <img 
                  src={industry.imageUrl} 
                  alt={industry.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors"></div>
              </div>
              
              <h3 className="text-2xl font-extrabold text-primary mb-6">{industry.name}</h3>
              
              <ul className="grid grid-cols-1 gap-3 flex-grow">
                {industry.roles.map(role => {
                  const displayName = role.toLowerCase().includes('roller') ? role : `${role} Roller`;
                  return (
                    <li key={role} className="text-sm">
                      <Link 
                        to={`/catalog?category=${industry.name}&search=${role}`}
                        className="flex items-center gap-2 text-slate-500 hover:text-secondary font-bold transition-colors"
                      >
                        <span className="w-2 h-2 bg-accent rounded-full"></span>
                        {displayName}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              
              <button 
                onClick={() => navigate(`/catalog?category=${industry.name}`)}
                className="mt-8 text-primary font-extrabold text-xs uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all"
              >
                View Full Category →
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IndustryShowcase;
