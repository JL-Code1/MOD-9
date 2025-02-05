import { Router } from 'express';
import apiRoutes from './api/index.js';
import htmlRoutes from './htmlRoutes.js';

console.log("➡️ Loading API and HTML routes...");

const router = Router();
router.use('/api', apiRoutes);
router.use('/', htmlRoutes);

console.log("✅ API and HTML routes loaded.");

export default router;

