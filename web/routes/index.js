import express from 'express';
import timersRouter from './timer.routes.js';

const router = express.Router();

router.use('/timers', timersRouter);

export default router;
