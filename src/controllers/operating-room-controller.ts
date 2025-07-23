import { Request, Response } from 'express';
import { hospitalService } from '../services/hospital-service';

export const operatingRoomController = {
  getAll: (req: Request, res: Response) => {
    const rooms = hospitalService.getOperatingRooms();
    res.json(rooms);
  }
}; 