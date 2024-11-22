"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideogameController = void 0;
const videogame_service_1 = require("../services/videogame.service");
class VideogameController {
    constructor() {
        this.videogameService = new videogame_service_1.VideogameService();
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const videogameData = req.body;
                const result = yield this.videogameService.create(videogameData);
                res.status(201).json(result);
            }
            catch (error) {
                res.status(500).json({ message: 'Error creating videogame' });
            }
        });
    }
    findAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const videogames = yield this.videogameService.findAll();
                res.json(videogames);
            }
            catch (error) {
                res.status(500).json({ message: 'Error fetching videogames' });
            }
        });
    }
    findOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const videogame = yield this.videogameService.findOne(id);
                if (!videogame) {
                    return res.status(404).json({ message: 'Videogame not found' });
                }
                res.json(videogame);
            }
            catch (error) {
                res.status(500).json({ message: 'Error fetching videogame' });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const updateData = req.body;
                const result = yield this.videogameService.update(id, updateData);
                if (!result) {
                    return res.status(404).json({ message: 'Videogame not found' });
                }
                res.json(result);
            }
            catch (error) {
                res.status(500).json({ message: 'Error updating videogame' });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const success = yield this.videogameService.delete(id);
                if (!success) {
                    return res.status(404).json({ message: 'Videogame not found' });
                }
                res.status(204).send();
            }
            catch (error) {
                res.status(500).json({ message: 'Error deleting videogame' });
            }
        });
    }
}
exports.VideogameController = VideogameController;
//# sourceMappingURL=videogame.controller.js.map