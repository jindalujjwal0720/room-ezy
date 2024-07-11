import { Response, NextFunction } from 'express';

// db
import { applicationDB } from '../config/db';

// middlewares
import { RequestWithUser } from '../middlewares/auth';

// models
import BuildingCreator from '../models/Building';
import BlockCreator from '../models/Block';
import FloorCreator from '../models/Floor';
import RoomCreator from '../models/Room';
const Building = BuildingCreator(applicationDB);
const Block = BlockCreator(applicationDB);
const Floor = FloorCreator(applicationDB);
const Room = RoomCreator(applicationDB);

// utils
import { BadRequestError, NotFoundError } from '../utils/errors';
import { getRoomNameFromConvention } from '../utils/room';

class FloorController {
  static async getFloorsByBlock(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const blockId = req.query.block;
      if (!blockId) throw new BadRequestError('Invalid block');

      const floors = await Floor.find({ block: blockId });
      res.status(200).json({ floors });
    } catch (err) {
      next(err);
    }
  }

  static async getFloorById(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const floorId = req.params.floorId;
      if (!floorId) throw new BadRequestError('Invalid floor');

      const floor = await Floor.findById(floorId);
      if (!floor) throw new NotFoundError('Floor not found');

      res.status(200).json({ floor });
    } catch (err) {
      next(err);
    }
  }

  static async createFloorsInBlock(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { blockId, count } = req.body;
      if (!blockId) throw new BadRequestError('Invalid block');
      if (!count) throw new BadRequestError('Invalid count');

      let { mapType, roomsCount, roomCapacity, namingConvention } = req.body;

      // converting to strings for safe query
      mapType = mapType?.toString() || 'linear';
      roomsCount = Number(roomsCount?.toString()) || 0;
      roomCapacity = Number(roomCapacity?.toString()) || 1;
      namingConvention =
        namingConvention?.toString() || '{block}-{floor}-{room}';

      const block = await Block.findById(blockId);
      if (!block) throw new NotFoundError('Block not found');

      const building = await Building.findById(block.building);
      if (!building) throw new NotFoundError('Building not found');

      const floorObjects = Array.from({ length: count }).map((_, index) => ({
        block: blockId,
        name: `${index + 1}`,
        mapType,
        roomsCount,
        roomCapacity,
        namingConvention,
      }));

      const floors = await Floor.insertMany(floorObjects);

      // create rooms in each floor
      // using the config above
      const rooms = floors
        .map((floor) => {
          const { roomsCount, roomCapacity, namingConvention } = floor;
          return Array.from({ length: roomsCount }).map((_, index) => ({
            floor: floor._id,
            index: index + 1,
            name: getRoomNameFromConvention(namingConvention, {
              building: building.name,
              block: block.name,
              floor: floor.name,
              room: `${index + 1}`,
            }),
            capacity: roomCapacity,
          }));
        })
        .flat();

      await Room.insertMany(rooms);

      res.status(201).json({
        message: 'Floors and rooms created successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateFloor(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const floorId = req.params.floorId;
      if (!floorId) throw new BadRequestError('Invalid floor');

      const floor = await Floor.findById(floorId);
      if (!floor) throw new NotFoundError('Floor not found');

      let { namingConvention, mapType, roomsCount, roomCapacity, name } =
        req.body;

      // converting to strings for safe query
      namingConvention = namingConvention?.toString();
      mapType = mapType?.toString();
      roomsCount = Number(roomsCount?.toString()) || floor.roomsCount;
      roomCapacity = Number(roomCapacity?.toString()) || floor.roomCapacity;
      name = name?.toString().trim();

      floor.mapType = mapType || floor.mapType;
      floor.name = name || floor.name;

      const block = await Block.findById(floor.block);
      const building = await Building.findById(block?.building);
      if (!building || !block) {
        throw new NotFoundError('Building or block not found');
      }

      // TODO: if rooms count is updated
      // delete all rooms and create new ones
      // this is to avoid any conflicts
      if (roomsCount && roomsCount !== floor.roomsCount) {
        // delete all rooms
        await Room.deleteMany({ floor: floorId });

        // create new rooms
        const rooms = Array.from({ length: roomsCount }).map((_, index) => ({
          floor: floorId,
          index: index + 1,
          name: getRoomNameFromConvention(floor.namingConvention, {
            building: building.name,
            block: block.name,
            floor: floor.name,
            room: `${index + 1}`,
          }),
          capacity: roomCapacity,
        }));
        await Room.insertMany(rooms);
      }
      floor.roomsCount = roomsCount || floor.roomsCount;

      // TODO: if either naming convention, room capacity are updated
      // update all rooms naming convention
      // and room capacity
      if (
        (roomCapacity && roomCapacity !== floor.roomCapacity) ||
        (namingConvention && namingConvention !== floor.namingConvention)
      ) {
        const rooms = await Room.find({ floor: floorId });
        await Promise.all(
          rooms.map(async (room) => {
            room.name =
              getRoomNameFromConvention(
                namingConvention || floor.namingConvention,
                {
                  building: building.name,
                  block: block.name,
                  floor: floor.name,
                  room: `${room.index}`,
                }
              ) || room.name;
            room.capacity = roomCapacity || room.capacity;
            await room.save();
          })
        );
      }
      floor.roomCapacity = roomCapacity || floor.roomCapacity;
      floor.namingConvention = namingConvention || floor.namingConvention;

      await floor.save();
      res.status(200).json({ message: 'Floor and rooms updated successfully' });
    } catch (err) {
      next(err);
    }
  }

  static async deleteFloor(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const floorId = req.params.floorId;
      if (!floorId) throw new BadRequestError('Invalid floor');

      const floor = await Floor.findById(floorId);
      if (!floor) throw new NotFoundError('Floor not found');

      await Room.deleteMany({ floor: floorId });
      await Floor.findByIdAndDelete(floorId);

      res.status(200).json({ message: 'Floor deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
}

export default FloorController;
