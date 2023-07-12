import { EDroneState, ETables, IDrone } from "@/Type";
import knex from "@Database/index";
import { Service } from "typedi";

@Service()
class DroneAdapters {
  public DBcreateDrone = async (data: IDrone) => {
    try {
      const [drone] = await knex.table(ETables.DRONES).insert(data, "*");

      return drone;
    } catch (error) {
      throw error;
    }
  }

  public DBGetDrones = async (options: {
    startId: number,
    idRange?: [number, number],
    state: EDroneState,
    limit: number,
    page: "next" | "prev"
  }): Promise<[IDrone[], number]> => {
    const { startId, idRange, state, limit = 20, page } = options;

    try {
      const query = knex.from({ dt: ETables.DRONES })

      if (state) {
        query.where("state", state)
      } else {
        query.whereNotNull("state")
      }

      const [total] = await query.clone().count("id");

      if (page === "next") {
        query.andWhere("id", ">", startId)
      } else if (page === "prev" && idRange) {
        query.andWhereBetween("id", idRange);
      }

      const drones = await query.clone().select<IDrone[]>([
        "id",
        "serial_number",
        "model",
        "state",
        "weight_limit",
        "battery",
        "created_at",
        "updated_at",
        "deleted_at"
      ]).limit(limit).orderBy("id", "asc");

      return [drones, Number((total as any).count)]
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
