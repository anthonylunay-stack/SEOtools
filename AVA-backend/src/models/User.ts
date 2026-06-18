import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password?: string;
  prenom: string;
  nom: string;
  tel?: string;
  subscriptionStatus: 'active' | 'inactive' | 'cancelled' | 'referral';
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String },
  prenom: { type: String, required: true },
  nom: { type: String, required: true },
  tel: { type: String },
  subscriptionStatus: { type: String, enum: ['active','inactive','cancelled','referral'], default: 'inactive' },
  stripeCustomerId: { type: String },
  stripeSubscriptionId: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IUser>('User', UserSchema);
