import MedicationAdapter from "@/Database/adapters/medication";
import { logger } from "@/Logger";
import { created, serverError, success } from "@Utils/api_response";
import { Request, Response } from "express";
import { Service } from "typedi";

@Service()
class MedicationController {
  constructor(
    private readonly medicationAdapter: MedicationAdapter
  ) {}

  public createMedication = async (req: Request, res: Response) => {
    const { code, name, weight, image } = req.body;

    try {
      const drone = await this.medicationAdapter.DBCreateMedication({
        code, name, weight, image
      })

      return created(res, drone, "Medication registered successfully");
    } catch (error) {
      logger.error(error);
      return serverError(res);
    }
  }

  public getMedications =async (req: Request, res: Response) => {
    const search = req.query.search as string;

    try {
      const medications = await this.medicationAdapter.DBGetMedications(search);

      return success(res, medications);
    } catch (error) {
      logger.error(error);
      return serverError(res);
    }
  }

}

export default MedicationController;
