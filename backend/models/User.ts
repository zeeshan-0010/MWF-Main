import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  googleId: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'donor' | 'volunteer' | 'member' | 'public_supporter' | 'staff' | 'admin' | 'super_admin';
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  phone?: string;
  address?: string;
  bio?: string;
  reputation: number;
  lastLogin: Date;
  createdAt: Date;
}

const UserSchema = new Schema({
  googleId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  displayName: { type: String, required: true },
  photoURL: String,
  role: { 
    type: String, 
    enum: ['donor', 'volunteer', 'member', 'public_supporter', 'staff', 'admin', 'super_admin'],
    default: 'public_supporter'
  },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'suspended'],
    default: 'pending'
  },
  phone: String,
  address: String,
  bio: String,
  reputation: { type: Number, default: 0 },
  lastLogin: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model<IUser>('User', UserSchema);
