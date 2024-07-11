import { NextFunction, Response } from 'express';
import { RequestWithUser } from '../middlewares/auth';
import { BadRequestError } from '../utils/errors';

// db
import { applicationDB } from '../config/db';

// models
import RoomCreator from '../models/Room';
import mongoose from 'mongoose';
const Room = RoomCreator(applicationDB);

class RoomController {
  static async getRoomsOnFloor(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const floorId = req.query.floor;
      if (!floorId) throw new BadRequestError('Invalid floor');

      const rooms = await Room.find({ floor: floorId });
      res.status(200).json({ rooms });
    } catch (err) {
      next(err);
    }
  }

  static async getRoomsWantedByUser(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user.userId;

      const rooms = await Room.find({ wantedBy: { $in: [userId] } });
      res.status(200).json({ rooms });
    } catch (err) {
      next(err);
    }
  }

  static async updateRoomWantedByUser(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user.userId;
      const roomId = req.params.roomId;

      const room = await Room.findById(roomId).populate('wantedBy');
      if (!room) throw new BadRequestError('Invalid room');

      room.wantedBy = [
        ...new Set([...(room.wantedBy || []), userId]),
      ] as mongoose.Types.ObjectId[];

      room.wantedByCount = room.wantedBy.length;
      room.chance = Math.min(
        100,
        room.wantedByCount > 0
          ? Math.floor((room.capacity / room.wantedByCount) * 100)
          : 100
      );

      await room.save();
      res.status(200).json({ message: 'Room updated successfully' });
    } catch (err) {
      next(err);
    }
  }
}

export default RoomController;
