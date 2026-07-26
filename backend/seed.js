require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Product = require('./models/Product');
const User = require('./models/User');

const products = [
  {
    name: 'Classic Black Abaya',
    description:
      'Elegant flowy black abaya made from premium Nida fabric. Perfect for everyday wear and special occasions.',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800',
    category: 'Abaya',
    color: 'Black',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 25,
    rating: 4.8,
    numReviews: 24,
    featured: true,
  },
  {
    name: 'Embroidered Dubai Borkha',
    description:
      'Stunning Dubai-style borkha with delicate floral embroidery on sleeves and front. Soft, breathable fabric.',
    price: 3899,
    image: 'https://images.unsplash.com/photo-1622445275576-721325763afe?w=800',
    category: 'Abaya',
    color: 'Black',
    sizes: ['M', 'L', 'XL'],
    stock: 15,
    rating: 4.9,
    numReviews: 41,
    featured: true,
  },
  {
    name: 'Pearl Khimar Set',
    description:
      'Two-piece khimar set with pearl detailing. Includes flowy khimar and matching skirt. Lightweight chiffon.',
    price: 2799,
    image: 'https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?w=800',
    category: 'Khimar',
    color: 'Beige',
    sizes: ['Free Size'],
    stock: 30,
    rating: 4.7,
    numReviews: 18,
    featured: true,
  },
  {
    name: 'Premium Saudi Borkha',
    description:
      'Authentic Saudi-style borkha imported directly. Heavy fabric with luxurious finish. Includes matching hijab.',
    price: 4599,
    image: 'https://images.unsplash.com/photo-1611042553484-d61f84d22784?w=800',
    category: 'Abaya',
    color: 'Black',
    sizes: ['M', 'L', 'XL', 'XXL'],
    stock: 12,
    rating: 5.0,
    numReviews: 9,
    featured: true,
  },
  {
    name: 'Casual Daily Hijab',
    description:
      'Soft cotton-jersey hijab. Easy to style, no-pin needed. Available in multiple colors.',
    price: 599,
    image: 'https://images.unsplash.com/photo-1606744824163-985d376605aa?w=800',
    category: 'Hijab',
    color: 'Multi',
    sizes: ['Free Size'],
    stock: 80,
    rating: 4.6,
    numReviews: 112,
    featured: false,
  },
  {
    name: 'Niqab Veil with Eye Cover',
    description:
      'Premium two-layer niqab with adjustable eye cover. Comfortable elastic band, breathable fabric.',
    price: 499,
    image: 'https://images.unsplash.com/photo-1585399000684-d2f72660f092?w=800',
    category: 'Niqab',
    color: 'Black',
    sizes: ['Free Size'],
    stock: 50,
    rating: 4.5,
    numReviews: 33,
    featured: false,
  },
  {
    name: 'Stone Work Party Borkha',
    description:
      'Luxurious party-wear borkha with hand-stitched stone work. Perfect for weddings and gatherings.',
    price: 5299,
    image: 'https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?w=800',
    category: 'Abaya',
    color: 'Black',
    sizes: ['M', 'L', 'XL'],
    stock: 8,
    rating: 4.9,
    numReviews: 15,
    featured: true,
  },
  {
    name: 'Modest Maxi Dress',
    description:
      'Long-sleeve modest maxi dress in soft crepe fabric. Loose fit, can be paired with hijab.',
    price: 1899,
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800',
    category: 'Modest Dress',
    color: 'Navy',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 20,
    rating: 4.4,
    numReviews: 22,
    featured: false,
  },
];

const adminUser = {
  name: 'Admin',
  email: 'admin@oneseven17.com',
  password: 'admin123',
  isAdmin: true,
};

const importData = async () => {
  try {
    await connectDB();
    await Product.deleteMany();
    await User.deleteMany();
    await User.create(adminUser);
    await Product.insertMany(products);
    console.log('Data seeded successfully!');
    console.log('Admin login -> email: admin@oneseven17.com  password: admin123');
    process.exit();
  } catch (err) {
    console.error('Seed error', err);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    await Product.deleteMany();
    await User.deleteMany();
    console.log('Data destroyed!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') destroyData();
else importData();
