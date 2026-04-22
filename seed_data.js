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
    products: ['Ink Fountain', 'Ink Oscillator', 'Vibrator', 'Ink Rider', 'Ink Transfer', 'Alcohol Damper']
  },
  {
    name: 'Paper Mill',
    products: ['Back Up', 'Breast Roller', 'Couch Roller', 'M.G. Tuch', 'Drive Roller', 'Guide Roller']
  },
  {
    name: 'Steel & Coil Coating',
    products: ['Accumulator', 'Bridle', 'Chemical Coater', 'Deflector', 'Leveler', 'Oiler', 'Wringer']
  },
  {
    name: 'Textile Industry',
    products: ['Dip Tank Coater', 'Expander', 'Padder Roller', 'Press Roller', 'Slasher Nip', 'Warper Nip']
  },
  {
    name: 'Vinyl & Plywood',
    products: ['Embossing', 'Coating', 'Glue Spreader', 'Doctor Rollers', 'Sanding', 'Dipping']
  },
  {
    name: 'Tannery & Glass',
    products: ['Buffing', 'Splitting', 'Washing Machine', 'Feed Roller', 'Idler', 'Nip Rollers']
  }
];

const industryImages = {
  'Printing Industry': 'https://shreerubbtech.com/img/portfolio/item3.jpg',
  'Paper Mill': 'https://shreerubbtech.com/img/portfolio/item2.jpg',
  'Steel & Coil Coating': 'https://shreerubbtech.com/img/portfolio/item4.jpg',
  'Textile Industry': 'https://shreerubbtech.com/img/portfolio/item5.jpg',
  'Vinyl & Plywood': 'https://shreerubbtech.com/img/portfolio/item.jpg',
  'Tannery & Glass': 'https://shreerubbtech.com/img/portfolio/item7.jpg'
};

const productData = [];

industries.forEach(industry => {
  industry.products.forEach(prodName => {
    // Ensure we don't add " Roller" if the name already has it
    const fullName = prodName.toLowerCase().includes('roller') ? prodName : `${prodName} Roller`;
    
    productData.push({
      name: fullName,
      description: `High-performance ${fullName} specifically engineered for the ${industry.name}. Designed for maximum durability, precision alignment, and resistance to industrial chemicals.`,
      price: Math.floor(Math.random() * (60000 - 15000) + 15000),
      category: industry.name,
      image_url: industryImages[industry.name] || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
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
