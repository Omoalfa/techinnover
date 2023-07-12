import DroneAdapters from "@/Database/adapters/drones";
import { logger } from "@/Logger";
import { EDroneState } from "@/Type";
import { generatePageTag, getLastEndId, getPreviousPageRang } from "@/Utils/pagination";
import { created, serverError, success, successAction, successPaginated } from "@Utils/api_response";
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
      const drone = await this.droneAdapter.DBcreateDrone({
        serial_number, model, weight_limit, battery, state
      })

      return created(res, drone, "Drone registered successfully");
    } catch (error) {
      logger.error(error);
      return serverError(res);
    }
  }

  public getDrone = async (req: Request, res: Response) => {
    const { state, limit = 20, page, pt } = req.query as any as { 
      state: "available" | "unavailable",
      limit: string,
      page: "next" | "prev",
      pt: string,
    }

    try {
      // deal with pagination settings:::
      let startId: number;
      let idRange: [number, number];

      if (page === "next") {
        startId = getLastEndId(pt);
      } else {
        idRange =  getPreviousPageRang(pt);
      }

      const [drones, total] = await this.droneAdapter.DBGetDrones({
        startId, idRange, state, page, limit: Number(limit)
      })

      /// Generate a new page tag:::
      const newRange: [number, number] = [drones?.[0]?.id, drones?.[drones.length - 1]?.id]
      const newPageTag = generatePageTag(newRange, page, pt)

      return successPaginated(res, {
        list: drones,
        limit: Number(limit),
        pageTag: newPageTag,
        total
      })
    } catch (error) {
      logger.error(error)
      return serverError(res)
    }
  }

  public loadDrone =async (req: Request, res: Response) => {
    const { medication_id, quantity } = req.body;
    const drone_id = Number(req.params.id)

    try {
      await this.droneAdapter.DBLoadDrone({
        drone_id, medication_id, quantity
      });

      return successAction(res);
    } catch (error) {
      logger.error(error)
      return serverError(res);
    }
  }

  public getDroneItems = async (req: Request, res: Response) => {
    const drone_id = Number(req.params.id)

    try {
      const [drone, items] = await this.droneAdapter.DBGetDroneItems(drone_id);

      return success(res, { drone, items });
    } catch (error) {
      logger.error(error);
      return serverError(res);
    }
  }
}

export default DroneController;
