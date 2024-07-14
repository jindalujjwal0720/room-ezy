import express from 'express';
const router = express.Router();
import cors from 'cors';

import AuthRoutes from './auth';
import BuildingRoutes from './building';
import BlockRoutes from './building_block';
import FloorRoutes from './floor';
import RoomRoutes from './room';
import LogsRoutes from './logs';

// cors
router.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(','), // ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);

router.use('/auth', AuthRoutes);
router.use('/buildings', BuildingRoutes);
router.use('/blocks', BlockRoutes);
router.use('/floors', FloorRoutes);
router.use('/rooms', RoomRoutes);
router.use('/logs', LogsRoutes);

export default router;
