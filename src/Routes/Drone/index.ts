import DroneController from "@/Controller/Drone";
import { Routes } from "@/Interfaces/router";
import DroneValidator from "@/Validations/drone";
import { Router } from "express";
import { Service } from "typedi";

@Service()
class DroneRouter implements Routes {
  constructor (
    private readonly droneController: DroneController,
    private readonly droneValidator: DroneValidator
  ) {
    this.path = "/drones";
    this.router = Router();

    this.initializeRoutes()
  }

  public path: string;
  public router: Router;

  private initializeRoutes () {
    this.router.post('/', this.droneValidator.validateCreateDrone, this.droneController.createDrone);
    this.router.get('/', this.droneValidator.validateGetDronesQuery, this.droneController.getDrone);
    this.router.post('/:id', this.droneValidator.validateDroneId, this.droneValidator.validateDroneLoad, this.droneController.loadDrone);
    this.router.get('/:id', this.droneValidator.validateDroneId, this.droneController.getDroneItems);
  }
}

export default DroneRouter;
