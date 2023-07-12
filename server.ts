import "reflect-metadata";

import Container from "typedi";
import App from ".";
import DroneRouter from "@/Routes/Drone";
import MedicationRouter from "@/Routes/Medication";

const droneRouter = Container.get(DroneRouter);
const medicationRouter = Container.get(MedicationRouter);

const instance = new App([droneRouter, medicationRouter])

instance.listen();

const app = instance.getServer(); 

export default app;
