import mongoose from 'mongoose';

const blockSchema = new mongoose.Schema(
  {
    building: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Building',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
  },
  {
    timestamps: true,
  }
);

export type BlockDoc = mongoose.Document & {
  building: mongoose.Types.ObjectId;
  name: string;
} & {
  createdAt: Date;
  updatedAt: Date;
};

export default (db: mongoose.Connection): mongoose.Model<BlockDoc> => {
  if (!db.models.Block)
    return db.model(
      'Block',
      blockSchema
    ) as unknown as mongoose.Model<BlockDoc>;
  return db.models.Block;
};
