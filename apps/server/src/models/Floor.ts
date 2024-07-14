import mongoose from 'mongoose';

const floorSchema = new mongoose.Schema(
  {
    block: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BuildingBlock',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    mapType: {
      type: String,
      required: true,
      enum: [
        'linear',
        'alternate',
        'opposite',
        'rectangle',
        'opposite-rectangle',
      ],
      default: 'linear',
    },
    namingConvention: {
      type: String,
      required: true,
      default: '{block}-{floor}-{room}',
    },
    roomsCount: {
      type: Number,
      default: 0,
    },
    roomCapacity: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

export type FloorDoc = mongoose.Document & {
  block: mongoose.Types.ObjectId;
  name: string;
  mapType: string;
  namingConvention: string;
  roomsCount: number;
  roomCapacity: number;
} & {
  createdAt: Date;
  updatedAt: Date;
};

export default (db: mongoose.Connection): mongoose.Model<FloorDoc> => {
  if (!db.models.Floor)
    return db.model(
      'Floor',
      floorSchema
    ) as unknown as mongoose.Model<FloorDoc>;
  return db.models.Floor;
};
