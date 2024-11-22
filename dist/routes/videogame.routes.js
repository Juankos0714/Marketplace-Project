"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const videogame_controller_1 = require("../controllers/videogame.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
const videogameController = new videogame_controller_1.VideogameController();
router.post('/', [auth_middleware_1.authMiddleware], videogameController.create.bind(videogameController));
router.get('/', videogameController.findAll.bind(videogameController));
router.get('/:id', videogameController.findOne.bind(videogameController));
router.put('/:id', [auth_middleware_1.authMiddleware], videogameController.update.bind(videogameController));
router.delete('/:id', [auth_middleware_1.authMiddleware], videogameController.delete.bind(videogameController));
exports.default = router;
//# sourceMappingURL=videogame.routes.js.map