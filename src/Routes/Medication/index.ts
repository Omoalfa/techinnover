import MedicationController from "@/Controller/Medication";
import { Routes } from "@/Interfaces/router";
import FileUploader from "@/Middlewares/upload";
import MedicationValidation from "@/Validations/medication";
import { Router } from "express";
import { Service } from "typedi";

@Service()
class MedicationRouter implements Routes {
  constructor (
    private readonly medicationValidator: MedicationValidation,
    private readonly fileUploader: FileUploader,
    private readonly medicationController: MedicationController
  ) {
    this.path = "/medications";
    this.router = Router();

    this.initializeRoutes()
  }

  public path: string;
  public router: Router;

  private initializeRoutes () {
    this.router.post('/', this.fileUploader.upload, this.medicationValidator.validateCreateMedication, this.medicationController.createMedication);
    this.router.get('/', this.medicationController.getMedications);
  }
}

export default MedicationRouter;
