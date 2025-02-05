import { Router } from 'express';
import weatherRoutes from './weatherRoutes.js';

const router = Router();

// ✅ Ensure `/weather` is actually registered
console.log("➡️ Registering /weather route...");
router.use('/weather', weatherRoutes);
console.log("/api/weather should now be registered.");

export default router;
