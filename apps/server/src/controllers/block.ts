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

class BlockController {
  static async getBlocksByBuilding(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const buildingId = req.query.building;
      if (!buildingId) throw new BadRequestError('Invalid building');

      const blocks = await Block.find({ building: buildingId });
      res.status(200).json({ blocks });
    } catch (err) {
      next(err);
    }
  }

  static async getBlockById(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const blockId = req.params.blockId;
      if (!blockId) throw new BadRequestError('Invalid block');

      const block = await Block.findById(blockId);
      if (!block) throw new NotFoundError('Block not found');

      res.status(200).json({ block });
    } catch (err) {
      next(err);
    }
  }

  static async createBlocksInBuilding(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { buildingId, count } = req.body;
      if (!buildingId) throw new BadRequestError('Invalid building');
      if (!count) throw new BadRequestError('Invalid count');

      const building = await Building.findById(buildingId);
      if (!building) throw new NotFoundError('Building not found');

      const blocks = Array.from({ length: count }).map((_, index) => ({
        name: String.fromCharCode(65 + index),
        building: buildingId,
      }));

      await Block.insertMany(blocks);
      res.status(201).json({ message: 'Blocks created successfully' });
    } catch (err) {
      next(err);
    }
  }

  static async updateBlock(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const blockId = req.params.blockId;
      if (!blockId) throw new BadRequestError('Invalid block');

      const block = await Block.findById(blockId);
      if (!block) throw new NotFoundError('Block not found');

      let { name } = req.body;

      // converting to strings for safe query
      name = name?.toString();

      block.name = name || block.name;

      await block.save();
      res.status(200).json({ message: 'Block updated successfully' });
    } catch (err) {
      next(err);
    }
  }

  static async deleteBlock(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const blockId = req.params.blockId;
      if (!blockId) throw new BadRequestError('Invalid block');

      const block = await Block.findById(blockId);
      if (!block) throw new NotFoundError('Block not found');

      const floors = await Floor.find({ block: blockId }).select('_id');
      const floorIds = floors.map((floor) => floor._id);

      await Room.deleteMany({ floor: { $in: floorIds } });
      await Floor.deleteMany({ block: blockId });
      await Block.findByIdAndDelete(blockId);

      res.status(200).json({ message: 'Block deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
}

export default BlockController;
