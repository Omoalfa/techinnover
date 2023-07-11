import { ETables, IDrone } from "@/Type";
import knex from "@Database/index";
import { Service } from "typedi";

@Service()
class DroneAdapters {
  public createDrone = async (data: IDrone) => {
    try {
      const drone = await knex.table(ETables.DRONES).insert(data, "*");

      return drone;
    } catch (error) {
      throw error;
    }
  }
}

export default DroneAdapters;
