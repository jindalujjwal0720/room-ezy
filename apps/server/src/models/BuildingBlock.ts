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

export type BuildingBlockDoc = mongoose.Document & {
  building: mongoose.Types.ObjectId;
  name: string;
} & {
  createdAt: Date;
  updatedAt: Date;
};

export default (db: mongoose.Connection): mongoose.Model<BuildingBlockDoc> => {
  if (!db.models.BuildingBlock)
    return db.model(
      'BuildingBlock',
      blockSchema
    ) as unknown as mongoose.Model<BuildingBlockDoc>;
  return db.models.BuildingBlock;
};
