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
    image_url: 'https://images.unsplash.com/photo-1595113316349-9fa4ee24f884?auto=format&fit=crop&q=80&w=800',
    products: ['Ink Fountain', 'Ink Oscillator', 'Vibrator', 'Ink Rider', 'Ink Transfer', 'Alcohol Damper']
  },
  {
    name: 'Paper Mill',
    image_url: 'https://images.unsplash.com/photo-1589793907316-f94025b46850?auto=format&fit=crop&q=80&w=800',
    products: ['Back Up', 'Breast Roller', 'Couch Roller', 'M.G. Tuch', 'Drive Roller', 'Guide Roller']
  },
  {
    name: 'Steel & Coil Coating',
    image_url: 'https://images.unsplash.com/photo-1517146431317-061803623700?auto=format&fit=crop&q=80&w=800',
    products: ['Accumulator', 'Bridle', 'Chemical Coater', 'Deflector', 'Leveler', 'Oiler', 'Wringer']
  },
  {
    name: 'Textile Industry',
    image_url: 'https://images.unsplash.com/photo-1558444479-c84851727ec1?auto=format&fit=crop&q=80&w=800',
    products: ['Dip Tank Coater', 'Expander', 'Padder Roller', 'Press Roller', 'Slasher Nip', 'Warper Nip']
  },
  {
    name: 'Vinyl & Plywood',
    image_url: 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=800',
    products: ['Embossing', 'Coating', 'Glue Spreader', 'Doctor Rollers', 'Sanding', 'Dipping']
  },
  {
    name: 'Tannery & Glass',
    image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
    products: ['Buffing', 'Splitting', 'Washing Machine', 'Feed Roller', 'Idler', 'Nip Rollers']
  }
];

const productData = [];

industries.forEach(industry => {
  industry.products.forEach(prodName => {
    productData.push({
      name: `${prodName} Roller`,
      description: `High-performance ${prodName} roller specifically engineered for the ${industry.name}. Designed for maximum durability, precision alignment, and resistance to industrial chemicals.`,
      price: Math.floor(Math.random() * (60000 - 15000) + 15000),
      category: industry.name,
      image_url: industry.image_url,
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
