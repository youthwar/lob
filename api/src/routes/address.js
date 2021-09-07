import { Router } from 'express';
import addressController from '../controllers/address';
const router = Router();

router.get('/', addressController.GET);
router.post('/', addressController.POST);

router.put('/:id', addressController.PUT);
router.delete('/:id', addressController.DELETE);

export default router;
