import { Router } from 'express';
import { predict } from '../controller/PredictController.js';

const router = Router();

router.post('/', predict);

export default router;
