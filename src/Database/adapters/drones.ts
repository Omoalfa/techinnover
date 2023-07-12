import { EDeliveryStatus, EDroneState, ETables, IDelivery, IDrone } from "@/Type";
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
    state: "available" | "unavailable",
    limit: number,
    page: "next" | "prev"
  }): Promise<[IDrone[], number]> => {
    const { startId, idRange, state, limit = 20, page } = options;

    try {
      const query = knex.from({ dt: ETables.DRONES })

      if (state === "available") {
        query.whereIn("state", [EDroneState.IDLE, EDroneState.LOADING])
      } else if (state === "unavailable") {
        query.whereIn("state", [EDroneState.DELIVERED, EDroneState.DELIVERING, EDroneState.LOADED, EDroneState.RETURNING])
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

  public DBLoadDrone = async (options: {
    drone_id: number,
    medication_id: number,
    quantity: number;
  }) => {
    const { drone_id, medication_id, quantity } = options;
    try {
      const drone = await knex.select(["current_delivery_id", "id", "weight_limit"]).from(ETables.DRONES).where<IDrone>("id", drone_id).first()

      const medication = await knex.select("weight").from(ETables.MEDICATIONS).where("id", medication_id).first()

      if (!drone) throw new Error("Drone not found");

      if (!drone.current_delivery_id) {
        await knex.transaction(async (trx) => {
          if (drone.weight_limit < medication.weight * quantity) throw new Error("Weight limit exceeded");

          const [delivery] = await trx.table(ETables.DELIVERY).insert({ destination: "destination", drone_id, total_weight: medication.weight * quantity, status: EDeliveryStatus.LOADING }).returning("*");

          await trx.table(ETables.DELIEVERY_ITEMS).insert({ medication_id, delivery_id: delivery.id, quantity  })

          await trx.table(ETables.DRONES).update({ current_delivery_id: delivery.id }).where("id", drone_id).onConflict().merge(true);
        })
      } else {
        await knex.transaction(async (trx) => {
          const delivery = await trx.select("weight").from(ETables.DELIVERY).where<IDelivery>("id", drone.current_delivery_id).first()
          
          if (
            delivery.status === EDeliveryStatus.CLOSED ||
            delivery.status === EDeliveryStatus.FULL
            ) {
            await trx.table(ETables.DRONES).update({ current_delivery_id: null }).where("id", drone_id).onConflict().merge();

            throw new Error("Something went wrong");
          }

          const weight = delivery.total_weight + (medication.weight * quantity)

          if (weight > drone.weight_limit) {
            throw new Error("weight limit exceeded");
          }

          await trx.table(ETables.DELIEVERY_ITEMS).insert({ medication_id, delivery_id: drone.current_delivery_id, quantity  })

          const status = Math.round(drone.weight_limit) == Math.round(weight) ? EDeliveryStatus.FULL : EDeliveryStatus.LOADING
          
          await trx.table(ETables.DELIVERY).update({ total_weight: weight, status }).where("id", delivery.id).onConflict().merge(true)
        })
        
      }
    } catch (error) {
      throw error;
    }
  }

  public DBGetDroneItems = async (drone_id: number) => {
    try {
      const drone = await knex
      .select([
        "dt.id as id", "dt.created_at as created_at", "dt.serial_number as serial_number",
        "dt.model as model", "dt.weight_limit as weight_limit", "dt.battery as battey",
        "dt.state as state", "dt.current_delivery_id as delivery_id",
        "det.total_weight", "det.destination", "dt.updated_at as updated_at", "dt.deleted_at as deleted_at"
      ])
      .from({ dt: ETables.DRONES })
      .where("dt.id", drone_id)
      .leftJoin({ det: ETables.DELIVERY }, "det.id", "dt.current_delivery_id")
      .first()

      const items = await knex.select([
        "dit.id as dit_id",
        "mt.name as name",
        "mt.code as code",
        "mt.image as image",
        "mt.weight as weight",
        "mt.id as medication_id"
      ])
      .from({ dit: ETables.DELIEVERY_ITEMS })
      .where("dit.delivery_id", drone.delivery_id)
      .leftJoin({ mt: ETables.MEDICATIONS }, "dit.medication_id", "mt.id")

      return [drone, items];
    } catch (error) {
      throw error;
    }
  }
}
@Service()
export class DroneValidatorAdapters {
  public DBIsSerialNumberExist = async (sn: string): Promise<boolean> => {
    try {
      const drone = await knex.select(["id", "serial_number", "battery"]).from(ETables.DRONES).where("serial_number", sn).first();

      if (drone) return true;
      return false;
    } catch (error) {
      throw error;
    }
  }

  public DBIsDroneIdExist = async (id: number): Promise<[boolean, any]> => {
    try {
      const drone = await knex.select(["dt.id as id", "dt.serial_number", "dt.weight_limit as weight_limit", "det.total_weight as total_weight", "dt.state", "dt.current_delivery_id"]).from({dt: ETables.DRONES}).where("dt.id", id).leftJoin({ det: ETables.DELIVERY }, "dt.current_delivery_id", "det.id").first();

      if (drone) return [true, drone];
      return [false, drone];
    } catch (error) {
      throw error;
    }
  }

  public DBIsMedicationIdExist = async (id: number) => {
    try {
      const medication = await knex.select(["id", "code", "weight"]).from(ETables.MEDICATIONS).where("id", id).first();

      return medication;
    } catch (error) {
      throw error;
    }
  }
}

@Service()
export class CronDroneAdapters {
  public getAllDrones = async () => {
    try {
      const drones = await knex.select("*").from(ETables.DRONES).where<IDrone[]>("deleted_at", null);

      return drones;
    } catch (error) {
      throw error;
    }
  }

  public updateDroneBattery = async (id: number, battery: number) => {
    try {
      await knex.table(ETables.DRONES).update({ battery }).where("id", id).onConflict().merge()

      return;
    } catch (error) {
      throw error;
    }
  }
}

export default DroneAdapters;
