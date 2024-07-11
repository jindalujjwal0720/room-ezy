import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
      default: 'NONE',
    },
    admissionNumber: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      default: 'NONE',
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    role: {
      type: String,
      default: 'student',
      enum: ['student', 'admin'],
    },

    otp: {
      type: String,
      trim: true,
    },
    otpExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export type UserDoc = mongoose.Document & {
  name: string;
  email: string;
  admissionNumber: string;
  role: 'student' | 'admin';
  otp?: string;
  otpExpires?: Date;
} & {
  createdAt: Date;
  updatedAt: Date;
};

export default (db: mongoose.Connection): mongoose.Model<UserDoc> => {
  if (!db.models.User)
    return db.model('User', userSchema) as unknown as mongoose.Model<UserDoc>;
  return db.models.User;
};
