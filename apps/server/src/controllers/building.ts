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

      await Building.create({ name });
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

      const blocks = await Block.find({ building: buildingId }).select('_id');
      const blockIds = blocks.map((block) => block._id);

      const floors = await Floor.find({ block: { $in: blockIds } }).select(
        '_id'
      );
      const floorIds = floors.map((floor) => floor._id);

      await Room.deleteMany({ floor: { $in: floorIds } });

      await Floor.deleteMany({ _id: { $in: floorIds } });
      await Block.deleteMany({ _id: { $in: blockIds } });
      await Building.findByIdAndDelete(buildingId);

      res.status(200).json({ message: 'Building deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
}

export default BuildingController;
