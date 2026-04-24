// Use this script to seed comprehensive products into your Supabase database
require('dotenv').config({ path: './server/.env' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const industries = [
  {
    name: 'Printing Industry',
    products: ['Ink Fountain Roller', 'Ink Oscillator Roller', 'Vibrator Roller', 'Ink Rider Roller', 'Ink Transfer Roller', 'Alcohol Damper Roller'],
    imageUrl: 'https://shreerubbtech.com/img/portfolio/item3.jpg'
  },
  {
    name: 'Automobile Industry',
    products: ['Oil Seals', 'O-Rings', 'Bellows', 'Dust Covers', 'Engine Mounts', 'Gaskets'],
    imageUrl: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Infrastructure & Construction',
    products: ['AV Mountings', 'Bridge Bearings', 'Expansion Joints', 'D-Fenders', 'Water Stops', 'Pads'],
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Textile Industry',
    products: ['Padder Roller', 'Expander Roller', 'Press Roller', 'Slasher Nip Roller', 'Warper Nip Roller', 'Dip Tank Coater'],
    imageUrl: 'https://shreerubbtech.com/img/portfolio/item5.jpg'
  },
  {
    name: 'Paper Mill',
    products: ['Breast Roller', 'Couch Roller', 'M.G. Tuch Roller', 'Drive Roller', 'Guide Roller', 'Back Up Roller'],
    imageUrl: 'https://shreerubbtech.com/img/portfolio/item2.jpg'
  },
  {
    name: 'General Engineering',
    products: ['Coupling Elements', 'Diaphragms', 'Silent Block Bushes', 'Rubber Buckets', 'Star Couplers', 'Spider Couplers'],
    imageUrl: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&q=80&w=800'
  }
];

const productData = [];

const materials = ['Nitrile', 'EPDM', 'Neoprene', 'HNBR', 'Viton', 'Hypalon', 'Silicon', 'Polyurethane (PU)'];

industries.forEach(industry => {
  industry.products.forEach(prodName => {
    const selectedMaterial = materials[Math.floor(Math.random() * materials.length)];
    
    productData.push({
      name: prodName,
      description: `Premium ${prodName} manufactured with high-grade ${selectedMaterial} compound. Engineered for the ${industry.name} to withstand extreme industrial conditions, heat, and chemical exposure. Compliant with IS 5382 and ISI 7466 standards.`,
      price: Math.floor(Math.random() * (60000 - 5000) + 5000),
      category: industry.name,
      image_url: industry.imageUrl,
      availability: true
    });
  });
});


async function seed() {
  console.log('Cleaning existing products...');
  await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  
  console.log('Seeding new industrial products...');
  const { error } = await supabase.from('products').insert(productData);
  if (error) {
    console.error('Error seeding:', error);
  } else {
    console.log(`Seeded ${productData.length} products successfully!`);
  }
}

seed();
