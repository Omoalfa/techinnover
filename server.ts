import "reflect-metadata";

import Container from "typedi";
import App from ".";
import DroneRouter from "@/Routes/Drone";

const droneRouter = Container.get(DroneRouter);

const instance = new App([droneRouter])

instance.listen();

const app = instance.getServer(); 

export default app;
