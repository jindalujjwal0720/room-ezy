import mongoose from 'mongoose';
import { Response, NextFunction } from 'express';
import fs from 'fs';

// middlewares
import { RequestWithUser } from '../middlewares/auth';

// db
import { applicationDB } from '../config/db';

// models
import BuildingCreator from '../models/Building';
import BlockCreator from '../models/BuildingBlock';
import FloorCreator from '../models/Floor';
import RoomCreator, { RoomDoc } from '../models/Room';
import ActionAuditLogCreator from '../models/ActionAuditLog';
const Building = BuildingCreator(applicationDB);
const BuildingBlock = BlockCreator(applicationDB);
const Floor = FloorCreator(applicationDB);
const Room = RoomCreator(applicationDB);
const ActionAuditLog = ActionAuditLogCreator(applicationDB);

interface User {
  _id: string;
  admissionNumber: string;
}

// utils
import { BadRequestError, NotFoundError } from '../utils/errors';
import { allocateRooms } from '../utils/allocation';

class BuildingController {
  static async getBuildings(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const buildings = await Building.find();
      res.status(200).json({ buildings });
    } catch (err) {
      next(err);
    }
  }

  static async getBuildingById(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const buildingId = req.params.buildingId;
      if (!buildingId) throw new BadRequestError('Invalid building');

      const building = await Building.findById(buildingId);
      if (!building) throw new NotFoundError('Building not found');

      res.status(200).json({ building });
    } catch (err) {
      next(err);
    }
  }

  static async createBuilding(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { name } = req.body;
      if (!name) throw new BadRequestError('Invalid building');

      const building = await Building.create({ name });

      await ActionAuditLog.create({
        action: 'CREATE_BUILDING',
        triggeredBy: req.user.userId,
        building: building._id,
      });

      res.status(201).json({ message: 'Building created successfully' });
    } catch (err) {
      next(err);
    }
  }

  static async updateBuilding(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const buildingId = req.params.buildingId;
      let { name } = req.body;

      if (!buildingId) throw new BadRequestError('Invalid building');

      // sanitize name
      name = name?.toString().trim();

      const building = await Building.findById(buildingId);
      if (!building) throw new NotFoundError('Building not found');

      building.name = name || building.name;
      await building.save();

      res.status(200).json({ message: 'Building updated successfully' });
    } catch (err) {
      next(err);
    }
  }

  static async deleteBuilding(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const buildingId = req.params.buildingId;
      if (!buildingId) throw new BadRequestError('Invalid building');

      const building = await Building.findById(buildingId);
      if (!building) throw new NotFoundError('Building not found');

      const blocks = await BuildingBlock.find({ building: buildingId }).select(
        '_id'
      );
      const blockIds = blocks.map((block) => block._id);

      const floors = await Floor.find({ block: { $in: blockIds } }).select(
        '_id'
      );
      const floorIds = floors.map((floor) => floor._id);

      await Room.deleteMany({ floor: { $in: floorIds } });

      await Floor.deleteMany({ _id: { $in: floorIds } });
      await BuildingBlock.deleteMany({ _id: { $in: blockIds } });
      await Building.findByIdAndDelete(buildingId);

      await ActionAuditLog.create({
        action: 'DELETE_BUILDING',
        triggeredBy: req.user.userId,
        building: building._id,
      });

      res.status(200).json({ message: 'Building deleted successfully' });
    } catch (err) {
      next(err);
    }
  }

  static async generateProbableRoomsInBuilding(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { buildingId } = req.params;
      if (!buildingId) throw new BadRequestError('Invalid building');

      const blocks = await BuildingBlock.find({ building: buildingId }).select(
        '_id'
      );
      const blockIds = blocks.map((block) => block._id);

      const floors = await Floor.find({ block: { $in: blockIds } }).select(
        '_id'
      );
      const floorIds = floors.map((floor) => floor._id);

      // getting all rooms in the building
      const allRoomsInBuilding = (
        await Room.find({
          floor: { $in: floorIds },
        }).select('_id wantedBy capacity')
      ).map((room) => ({
        _id: (room._id as mongoose.Types.ObjectId).toString(),
        wantedBy: room.wantedBy.map((userId) => userId.toString()),
        capacity: room.capacity as number,
      }));

      const { allocation } = allocateRooms(allRoomsInBuilding);

      await Promise.all(
        Object.entries(allocation).map(([roomId, students]) =>
          Room.findByIdAndUpdate(roomId, { probableAllotedTo: students })
        )
      );

      await ActionAuditLog.create({
        action: 'PREDICT_ALLOCATION',
        triggeredBy: req.user.userId,
        building: buildingId,
      });

      res
        .status(200)
        .json({ message: 'Probable rooms generated successfully' });
    } catch (err) {
      next(err);
    }
  }

  static async allocateRoomsToStudents(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { buildingId } = req.params;
      if (!buildingId) throw new BadRequestError('Invalid building');

      const blocks = await BuildingBlock.find({ building: buildingId }).select(
        '_id'
      );
      const blockIds = blocks.map((block) => block._id);

      const floors = await Floor.find({ block: { $in: blockIds } }).select(
        '_id'
      );
      const floorIds = floors.map((floor) => floor._id);

      // getting all rooms in the building
      const allRoomsInBuilding = (
        await Room.find({
          floor: { $in: floorIds },
        }).select('_id wantedBy capacity')
      ).map((room) => ({
        _id: (room._id as mongoose.Types.ObjectId).toString(),
        wantedBy: room.wantedBy.map((userId) => userId.toString()),
        capacity: room.capacity as number,
      }));

      const { allocation } = allocateRooms(allRoomsInBuilding);

      await Promise.all(
        Object.entries(allocation).map(([roomId, students]) =>
          Room.findByIdAndUpdate(roomId, { allotedTo: students })
        )
      );

      await ActionAuditLog.create({
        action: 'ALLOCATE_ROOMS',
        triggeredBy: req.user.userId,
        building: buildingId,
      });

      res.status(200).json({ message: 'Rooms allocated successfully' });
    } catch (err) {
      next(err);
    }
  }

  static async downloadAllotmentCSVForBuilding(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { buildingId } = req.params;
      if (!buildingId) throw new BadRequestError('Invalid building');

      const building = await Building.findById(buildingId);
      if (!building) throw new NotFoundError('Building not found');

      const fileName = `room-allotment-${building.name.toLocaleLowerCase()}.csv`;
      const filePath = `./tmp/${fileName}`;

      const blocks = await BuildingBlock.find({ building: buildingId }).select(
        '_id'
      );
      const blockIds = blocks.map((block) => block._id);

      const floors = await Floor.find({ block: { $in: blockIds } }).select(
        '_id'
      );
      const floorIds = floors.map((floor) => floor._id);

      const rooms = (await Room.find({ floor: { $in: floorIds } }).populate(
        'allotedTo',
        'admissionNumber'
      )) as ({
        allotedTo: User[];
      } & RoomDoc)[];

      const columns = ['Room', 'Final Allotment'];
      const csv = [] as string[];
      csv.push(columns.join(','));
      rooms.forEach((room) => {
        const row = [
          room.name,
          room.allotedTo.map((student) => student.admissionNumber).join(', '),
        ];
        csv.push(row.join(','));
      });
      const csvData = csv.join('\n');

      fs.writeFileSync(filePath, csvData);

      res.download(filePath, fileName, () => {
        fs.unlinkSync(filePath);
      });
    } catch (err) {
      next(err);
    }
  }

  static async clearAllocationForBuilding(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const buildingId = req.params.buildingId;
      if (!buildingId) throw new BadRequestError('Invalid building');

      const blocks = await BuildingBlock.find({ building: buildingId }).select(
        '_id'
      );
      const blockIds = blocks.map((block) => block._id);

      const floors = await Floor.find({ block: { $in: blockIds } }).select(
        '_id'
      );
      const floorIds = floors.map((floor) => floor._id);

      await Room.updateMany(
        { floor: { $in: floorIds } },
        { $set: { allotedTo: [] } }
      );

      await ActionAuditLog.create({
        action: 'CLEAR_ALLOCATION',
        triggeredBy: req.user.userId,
        building: buildingId,
      });

      res.status(200).json({ message: 'Allocation cleared successfully' });
    } catch (err) {
      next(err);
    }
  }

  static async resetBuilding(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const buildingId = req.params.buildingId;
      if (!buildingId) throw new BadRequestError('Invalid building');

      const blocks = await BuildingBlock.find({ building: buildingId }).select(
        '_id'
      );
      const blockIds = blocks.map((block) => block._id);

      const floors = await Floor.find({ block: { $in: blockIds } }).select(
        '_id'
      );
      const floorIds = floors.map((floor) => floor._id);

      await Room.updateMany(
        { floor: { $in: floorIds } },
        { $set: { wantedBy: [], wantedByCount: 0, probableAllotedTo: [] } }
      );

      await ActionAuditLog.create({
        action: 'RESET_BUILDING',
        triggeredBy: req.user.userId,
        building: buildingId,
      });

      res.status(200).json({ message: 'Building reset successfully' });
    } catch (err) {
      next(err);
    }
  }
}

export default BuildingController;
