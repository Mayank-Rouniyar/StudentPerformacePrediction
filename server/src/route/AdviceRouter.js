import { Router } from 'express';
import { getAdvice } from '../controller/AdviceController.js';

const router = Router();

router.get('/', getAdvice);

export default router;
