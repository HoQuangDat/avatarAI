import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User';

dotenv.config({ path: '.env.local' });

async function upgrade() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) throw new Error('Cần MONGODB_URI');
  let cleanUri = MONGODB_URI.replace(/&w=majority\/$/, '&w=majority').replace(/majority\/$/, 'majority');
  await mongoose.connect(cleanUri);
  console.log('Connected to DB');

  const updateRes = await User.findOneAndUpdate(
    { email: 'demo_vip@avatarai.vn' },
    { $set: { plan: 'premium', credits: 999999 } },
    { new: true }
  );
  if (updateRes) {
    console.log('Upgraded demo_vip@avatarai.vn', updateRes.credits);
  } else {
    console.log('User not found');
  }
  process.exit(0);
}

upgrade();
