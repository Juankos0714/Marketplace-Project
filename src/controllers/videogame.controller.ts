import { Request, Response } from 'express';
import { VideogameService } from '../services/videogame.service';
import { CreateVideogameDto, UpdateVideogameDto } from '../dto/videogame.dto';

export class VideogameController {
  private videogameService: VideogameService;

  constructor() {
    this.videogameService = new VideogameService();
  }

  public async create(req: Request, res: Response) {
    try {
      const videogameData: CreateVideogameDto = req.body;
      const result = await this.videogameService.create(videogameData);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error creating videogame' });
    }
  }

  public async findAll(req: Request, res: Response) {
    try {
      const videogames = await this.videogameService.findAll();
      res.json(videogames);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching videogames' });
    }
  }

  public async findOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const videogame = await this.videogameService.findOne(id);
      
      if (!videogame) {
        return res.status(404).json({ message: 'Videogame not found' });
      }
      
      res.json(videogame);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching videogame' });
    }
  }

  public async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData: UpdateVideogameDto = req.body;
      
      const result = await this.videogameService.update(id, updateData);
      
      if (!result) {
        return res.status(404).json({ message: 'Videogame not found' });
      }
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error updating videogame' });
    }
  }

  public async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const success = await this.videogameService.delete(id);
      
      if (!success) {
        return res.status(404).json({ message: 'Videogame not found' });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting videogame' });
    }
  }

  // view details of a videogame

  public async getVideogameDetails(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const videogame = await this.videogameService.getVideogameDetails(id);
      
      if (!videogame) {
        return res.status(404).json({ message: 'Videogame not found' });
      }
      
      res.json(videogame);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching videogame details' });
    }
  }
}