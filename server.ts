import "reflect-metadata";

import Container from "typedi";
import UserRouter from "@Routes/User";
import App from ".";

const userRouter = Container.get(UserRouter);

const app = new App([userRouter])

app.listen();

export default app;
