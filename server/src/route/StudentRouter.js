import { Router } from 'express';
import { saveStudentData, getStudentData } from '../controller/StudentController.js';

const router = Router();

router.post('/data', saveStudentData);
router.get('/data', getStudentData);

export default router;
