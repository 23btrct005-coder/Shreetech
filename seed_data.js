// Use this script to seed products into your Supabase database
// You can run this with: node seed_data.js
require('dotenv').config({ path: './server/.env' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role for seeding
);

const products = [
  {
    name: "Embossing Roller (Standard)",
    description: "High-precision engraving for vinyl and paper industries. Exceptional pattern consistency.",
    price: 45000,
    category: "Printing",
    image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
    availability: true
  },
  {
    name: "Silicone Heat Resistant Roller",
    description: "Designed for extreme temperatures up to 250°C. Perfect for lamination and coating.",
    price: 32000,
    category: "Silicone",
    image_url: "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&q=80&w=800",
    availability: true
  },
  {
    name: "Heavy Duty Bridle Roller",
    description: "Robust steel mill roller for tension control. Hardened polyurethane surface for maximum grip.",
    price: 85000,
    category: "Steel Mill",
    image_url: "https://images.unsplash.com/photo-1504917595217-d4dc5f64d06a?auto=format&fit=crop&q=80&w=800",
    availability: true
  },
  {
    name: "Ink Oscillator Roller",
    description: "Precision ground for perfect ink distribution in high-speed offset printing presses.",
    price: 18000,
    category: "Printing",
    image_url: "https://images.unsplash.com/photo-1621905252507-b35242f38f4d?auto=format&fit=crop&q=80&w=800",
    availability: true
  },
  {
    name: "Wash Tank Squeegee Roller",
    description: "Chemical resistant EPDM coating. Ideal for textile processing and dyeing units.",
    price: 24000,
    category: "Textile",
    image_url: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&q=80&w=800",
    availability: true
  },
  {
    name: "Glue Spreader Roller",
    description: "Spiral grooved surface for even glue application in plywood and laminate manufacturing.",
    price: 29000,
    category: "Paper Mill",
    image_url: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&q=80&w=800",
    availability: true
  }
];

async function seed() {
  console.log('Seeding products...');
  const { data, error } = await supabase.from('products').insert(products);
  if (error) {
    console.error('Error seeding:', error);
  } else {
    console.log('Products seeded successfully!');
  }
}

seed();
