import { Request, Response } from "express";
import { getAddressFromCoords } from "../services/location.service";

export class LocationController {
  static async getAddress(req: Request, res: Response) {
    const { lat, lng } = req.body;

    if (!lat || !lng) {
      return res
        .status(400)
        .json({ error: "Latitude e longitude são obrigatórios" });
    }

    try {
      const address = await getAddressFromCoords(Number(lat), Number(lng));
      return res.json(address);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}
