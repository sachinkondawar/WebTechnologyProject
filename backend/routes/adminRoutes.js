import express from 'express';
import { signupAdmin, loginAdmin, getAllUsersResults } from '../controllers/adminController.js';
import adminProtect from '../middleware/adminMiddleware.js';

const router = express.Router();

router.post('/signup', signupAdmin);
router.post('/login', loginAdmin);
router.get('/results', adminProtect, getAllUsersResults);

export default router;
