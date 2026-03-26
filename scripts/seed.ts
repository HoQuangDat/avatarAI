import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('Missing MONGODB_URI');
    process.exit(1);
  }

  // Clean up any trailing slashes from write concern in the URI that might cause issues
  const cleanUri = uri.replace('w=majority/', 'w=majority').replace('w=majority', 'w=1');

  try {
    await mongoose.connect(cleanUri);
    console.log('Connected to DB');

    // Define minimum schema to seed
    const userSchema = new mongoose.Schema({
      email: String,
      name: String,
      passwordHash: String,
      provider: String,
      plan: String,
      credits: Number,
    }, { timestamps: true });

    const User = mongoose.models.User || mongoose.model('User', userSchema);

    const email = 'demo@avatarai.vn';
    const password = 'demo123';
    
    // Check if demo user exists
    const existing = await User.findOne({ email });
    if (existing) {
      console.log('Demo user already exists!');
      process.exit(0);
    }

    const passwordHash = await bcrypt.hash(password, 12);
    
    // Pass { w: 1 } as option if standalone mongo
    await User.create([{
      email,
      name: 'Demo Creator',
      passwordHash,
      provider: 'credentials',
      plan: 'free',
      credits: 99, // give lots of credits for demo
    }], { writeConcern: { w: 1 } });

    console.log('Demo user created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
