import { Router } from 'express';
import { VideogameController } from '../controllers/videogame.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const videogameController = new VideogameController();

router.post('/', [authMiddleware], videogameController.create.bind(videogameController));
router.get('/', videogameController.findAll.bind(videogameController));
router.get('/:id', videogameController.findOne.bind(videogameController));
router.put('/:id', [authMiddleware], videogameController.update.bind(videogameController));
router.delete('/:id', [authMiddleware], videogameController.delete.bind(videogameController));

export default router;