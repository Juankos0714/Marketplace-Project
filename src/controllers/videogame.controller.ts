import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Videogame } from '../entities/videogame.entity';
import { Between, Like } from 'typeorm';

export class VideogameController {
  private videogameRepository = AppDataSource.getRepository(Videogame);

  public async getAll(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const genre = req.query.genre as string;
      const platform = req.query.platform as string;
      const search = req.query.search as string;
      const minPrice = parseFloat(req.query.minPrice as string);
      const maxPrice = parseFloat(req.query.maxPrice as string);

      let whereClause: any = {};

      if (search) {
        whereClause.title = Like(`%${search}%`);
      }

      if (genre) {
        whereClause.genre = Like(`%${genre}%`);
      }

      if (platform) {
        whereClause.platform = Like(`%${platform}%`);
      }

      if (minPrice && maxPrice) {
        whereClause.price = Between(minPrice, maxPrice);
      }

      const [games, total] = await this.videogameRepository.findAndCount({
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
    } catch (error) {
      res.status(500).json({ message: 'Error fetching games' });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const game = await this.videogameRepository.findOne({
        where: { id: parseInt(req.params.id) }
      });

      if (!game) {
        return res.status(404).json({ message: 'Game not found' });
      }

      res.json(game);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching game' });
    }
  }

  public async create(req: Request, res: Response) {
    try {
      const game = this.videogameRepository.create(req.body);
      await this.videogameRepository.save(game);
      res.status(201).json(game);
    } catch (error) {
      res.status(500).json({ message: 'Error creating game' });
    }
  }

  public async update(req: Request, res: Response) {
    try {
      const game = await this.videogameRepository.findOne({
        where: { id: parseInt(req.params.id) }
      });

      if (!game) {
        return res.status(404).json({ message: 'Game not found' });
      }

      this.videogameRepository.merge(game, req.body);
      const result = await this.videogameRepository.save(game);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error updating game' });
    }
  }

  public async delete(req: Request, res: Response) {
    try {
      const result = await this.videogameRepository.delete(req.params.id);
      
      if (result.affected === 0) {
        return res.status(404).json({ message: 'Game not found' });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting game' });
    }
  }
}
