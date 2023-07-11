import "reflect-metadata";

import Container from "typedi";
import App from ".";
import DroneRouter from "@/Routes/Drone";

const droneRouter = Container.get(DroneRouter);

const app = new App([droneRouter])

app.listen();

export default app;
