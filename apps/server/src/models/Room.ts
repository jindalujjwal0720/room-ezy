import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    floor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Floor',
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    capacity: {
      type: Number,
      required: true,
      default: 1,
    },
    wantedBy: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: [],
      select: false,
    },
    wantedByCount: {
      type: Number,
      default: 0,
    },
    chance: {
      type: Number,
      required: true,
      default: 100,
    },
  },
  {
    timestamps: true,
  }
);

export type RoomDoc = mongoose.Document & {
  floor: mongoose.Types.ObjectId;
  index: number;
  name: string;
  capacity: number;
  wantedBy: mongoose.Types.ObjectId[];
  wantedByCount: number;
  chance: number;
} & {
  createdAt: Date;
  updatedAt: Date;
};

export default (db: mongoose.Connection): mongoose.Model<RoomDoc> => {
  if (!db.models.Room)
    return db.model('Room', roomSchema) as unknown as mongoose.Model<RoomDoc>;
  return db.models.Room;
};
