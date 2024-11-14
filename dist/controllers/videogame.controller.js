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
const database_1 = require("../config/database");
const videogame_entity_1 = require("../entities/videogame.entity");
const typeorm_1 = require("typeorm");
class VideogameController {
    constructor() {
        this.videogameRepository = database_1.AppDataSource.getRepository(videogame_entity_1.Videogame);
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const genre = req.query.genre;
                const platform = req.query.platform;
                const search = req.query.search;
                const minPrice = parseFloat(req.query.minPrice);
                const maxPrice = parseFloat(req.query.maxPrice);
                let whereClause = {};
                if (search) {
                    whereClause.title = (0, typeorm_1.Like)(`%${search}%`);
                }
                if (genre) {
                    whereClause.genre = (0, typeorm_1.Like)(`%${genre}%`);
                }
                if (platform) {
                    whereClause.platform = (0, typeorm_1.Like)(`%${platform}%`);
                }
                if (minPrice && maxPrice) {
                    whereClause.price = (0, typeorm_1.Between)(minPrice, maxPrice);
                }
                const [games, total] = yield this.videogameRepository.findAndCount({
                    where: whereClause,
                    skip: (page - 1) * limit,
                    take: limit,
                    order: { createdAt: 'DESC' }
                });
                res.json({
                    data: games,
                    meta: {
                        total,
                        page,
                        lastPage: Math.ceil(total / limit)
                    }
                });
            }
            catch (error) {
                res.status(500).json({ message: 'Error fetching games' });
            }
        });
    }
    getOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const game = yield this.videogameRepository.findOne({
                    where: { id: parseInt(req.params.id) }
                });
                if (!game) {
                    return res.status(404).json({ message: 'Game not found' });
                }
                res.json(game);
            }
            catch (error) {
                res.status(500).json({ message: 'Error fetching game' });
            }
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const game = this.videogameRepository.create(req.body);
                yield this.videogameRepository.save(game);
                res.status(201).json(game);
            }
            catch (error) {
                res.status(500).json({ message: 'Error creating game' });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const game = yield this.videogameRepository.findOne({
                    where: { id: parseInt(req.params.id) }
                });
                if (!game) {
                    return res.status(404).json({ message: 'Game not found' });
                }
                this.videogameRepository.merge(game, req.body);
                const result = yield this.videogameRepository.save(game);
                res.json(result);
            }
            catch (error) {
                res.status(500).json({ message: 'Error updating game' });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.videogameRepository.delete(req.params.id);
                if (result.affected === 0) {
                    return res.status(404).json({ message: 'Game not found' });
                }
                res.status(204).send();
            }
            catch (error) {
                res.status(500).json({ message: 'Error deleting game' });
            }
        });
    }
}
exports.VideogameController = VideogameController;
