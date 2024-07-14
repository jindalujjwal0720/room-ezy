import mongoose from 'mongoose';

const ACTION_TYPES = [
  'CREATE_BUILDING',
  'DELETE_BUILDING',
  'PREDICT_ALLOCATION',
  'ALLOCATE_ROOMS',
  'CLEAR_ALLOCATION',
  'RESET_BUILDING',
  'CLEAR_ACTION_LOGS',
] as const;

const actionAuditLogSchema = new mongoose.Schema(
  {
    triggeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: ACTION_TYPES,
    },
    building: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Building',
    },
    buildingBlock: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BuildingBlock',
    },
    floor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Floor',
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
    },
  },
  {
    timestamps: true,
  }
);

export type ActionAuditLogDoc = mongoose.Document & {
  triggeredBy: mongoose.Types.ObjectId;
  action: (typeof ACTION_TYPES)[number];
  building?: mongoose.Types.ObjectId;
  buildingBlock?: mongoose.Types.ObjectId;
  floor?: mongoose.Types.ObjectId;
  room?: mongoose.Types.ObjectId;
} & {
  createdAt: Date;
  updatedAt: Date;
};

export default (db: mongoose.Connection): mongoose.Model<ActionAuditLogDoc> => {
  if (!db.models.ActionAuditLog)
    return db.model(
      'ActionAuditLog',
      actionAuditLogSchema
    ) as unknown as mongoose.Model<ActionAuditLogDoc>;
  return db.models.ActionAuditLog;
};
