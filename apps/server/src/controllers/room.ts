import { NextFunction, Response } from 'express';
import mongoose from 'mongoose';
import { RequestWithUser } from '../middlewares/auth';
import { BadRequestError, NotFoundError } from '../utils/errors';

// db
import { applicationDB } from '../config/db';

// models
import RoomCreator from '../models/Room';
const Room = RoomCreator(applicationDB);

const allowedFields = [
  '_id',
  'index',
  'name',
  'capacity',
  'wantedByCount',
  'chance',
];

class RoomController {
  static async getRoomsOnFloor(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const floorId = req.query.floor;
      if (!floorId) throw new BadRequestError('Invalid floor');

      if (typeof req.query.select !== 'string') req.query.select = '';
      const selectQuery = [
        'capacity',
        'wantedByCount',
        ...req.query.select.split(','),
      ]
        .filter((field) => allowedFields.includes(field.trim()))
        .join(' ');

      const rooms = (
        await Room.find({ floor: floorId }).select(selectQuery)
      ).map((room) => ({
        ...room.toObject(),
        crowdRatio: room.wantedByCount / room.capacity,
        capacity: undefined,
        wantedByCount: undefined,
      }));

      res.status(200).json({ rooms });
    } catch (err) {
      next(err);
    }
  }

  static async getRoomById(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const roomId = req.params.roomId;
      if (!roomId) throw new BadRequestError('Invalid room');

      const room = await Room.findById(roomId).populate('allotedTo', 'name');
      if (!room) throw new NotFoundError('Room not found');

      res.status(200).json({ room });
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
      rooms.forEach((room) => {
        room.chance = Math.floor(
          (room.capacity / (room.wantedByCount * rooms.length)) * 100
        );
      });
      const maxWantsAllowed = process.env.MAX_ROOM_WANTS_PER_USER || 3;
      res.status(200).json({ rooms, maxWantsAllowed });
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

      if (
        room.wantedBy.includes(userId as unknown as mongoose.Types.ObjectId)
      ) {
        throw new BadRequestError(
          'You already shared preference for this room'
        );
      }

      room.wantedBy.push(userId as unknown as mongoose.Types.ObjectId);
      room.wantedByCount = room.wantedBy.length;

      await room.save();
      res.status(200).json({ message: 'Room updated successfully' });
    } catch (err) {
      next(err);
    }
  }

  static async getProbableRoomsForUser(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user.userId;

      const rooms = await Room.find({ probableAllotedTo: { $in: [userId] } });
      res.status(200).json({ rooms });
    } catch (err) {
      next(err);
    }
  }

  static async getAllotedRoomForUser(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user.userId;

      const room = await Room.findOne({ allotedTo: { $in: [userId] } });
      res.status(200).json({ room });
    } catch (err) {
      next(err);
    }
  }
}

export default RoomController;
