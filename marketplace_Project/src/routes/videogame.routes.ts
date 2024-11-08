import { Router } from 'express';
import { VideogameController } from '../controllers/videogame.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { adminMiddleware } from '../middleware/admin.middleware';

const router = Router();
const videogameController = new VideogameController();

router.get('/', videogameController.getAll.bind(videogameController));
router.get('/:id', videogameController.getOne.bind(videogameController));
router.post('/', [authMiddleware, adminMiddleware], videogameController.create.bind(videogameController));
router.put('/:id', [authMiddleware, adminMiddleware], videogameController.update.bind(videogameController));
router.delete('/:id', [authMiddleware, adminMiddleware], videogameController.delete.bind(videogameController));

export default router;