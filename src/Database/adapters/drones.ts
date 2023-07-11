import { ETables, IDrone } from "@/Type";
import knex from "@Database/index";
import { Service } from "typedi";

@Service()
class DroneAdapters {
  public createDrone = async (data: IDrone) => {
    try {
      const [drone] = await knex.table(ETables.DRONES).insert(data, "*");

      return drone;
    } catch (error) {
      throw error;
    }
  }
}

@Service()
export class DroneValidatorAdapters {
  public DBIsSerialNumberExist = async (sn: string): Promise<boolean> => {
    try {
      const drone = await knex.select(["id", "serial_number"]).from(ETables.DRONES).where("serial_number", sn).first();

      if (drone) return true;
      return false;
    } catch (error) {
      throw error;
    }
  }
}

export default DroneAdapters;
