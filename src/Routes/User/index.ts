import UserController from "@/Controller/User";
import { Routes } from "@/Interfaces/router";
import { Router } from "express";
import { Inject, Service } from "typedi";

@Service()
class UserRouter implements Routes {
  constructor (
    @Inject() private readonly userController: UserController
  ) {
    this.path = "/users";
    this.router = Router();

    this.initializeRoutes()
  }

  public path: string;
  public router: Router;

  private initializeRoutes () {
    this.router.get('/', this.userController.getAll);
  }
}

export default UserRouter;
