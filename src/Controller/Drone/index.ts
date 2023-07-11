import DroneAdapters from "@/Database/adapters/drones";
import { logger } from "@/Logger";
import { created, serverError } from "@Utils/api_response";
import { Request, Response } from "express";
import { Service } from "typedi";

@Service()
class DroneController {
  constructor(
    private readonly droneAdapter: DroneAdapters
  ) {}

  public createDrone = async (req: Request, res: Response) => {
    const { serial_number, model, weight_limit, battery, state } = req.body;

    try {
      const drone = await this.droneAdapter.createDrone({ 
        serial_number, model, weight_limit, battery, state
      })

      return created(res, drone, "Drone registered successfully");
    } catch (error) {
      logger.error(error);
      return serverError(res);
    }
  }
}

export default DroneController;
