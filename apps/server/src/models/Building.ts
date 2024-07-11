import mongoose from 'mongoose';

const buildingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
  },
  {
    timestamps: true,
  }
);

export type BuildingDoc = mongoose.Document & {
  name: string;
} & {
  createdAt: Date;
  updatedAt: Date;
};

export default (db: mongoose.Connection): mongoose.Model<BuildingDoc> => {
  if (!db.models.Building)
    return db.model(
      'Building',
      buildingSchema
    ) as unknown as mongoose.Model<BuildingDoc>;
  return db.models.Building;
};
