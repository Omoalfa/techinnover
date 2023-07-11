import knex from "@Database/index";
import { success } from "@Utils/api_response";
import { Request, Response } from "express";
import { Service } from "typedi";

@Service()
class UserController {


  public async getAll(req: Request, res: Response) {
    const users = await knex.table('users').select().limit(20)
    console.log(users);

    return success(res, users);
  }
}

export default UserController;
