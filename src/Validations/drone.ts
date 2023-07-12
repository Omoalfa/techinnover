import { Service } from "typedi";
import Validator from ".";
import { EDroneModel, EDroneState } from "@/Type";
import { DroneValidatorAdapters } from "@/Database/adapters/drones";

@Service()
class DroneValidator extends Validator {
  constructor (
    private readonly droneAdapter: DroneValidatorAdapters
  ) {
    super()
  }
  public validateCreateDrone = this.validate({
    serial_number: {
      in: ["body"],
      isLength: { options: { min: 1, max: 100 }},
      isString: true,
      custom: {
        options: async (sn) => {
          const exist = await this.droneAdapter.DBIsSerialNumberExist(sn);

          if (exist) throw new Error("Serial number in use!")
        }
      }
    },
    model: {
      in: ["body"],
      isIn: { options: [Object.values(EDroneModel)] }
    },
    weight_limit: {
      in: ["body"],
      isFloat: { options: { max: 500 }},
    },
    battery: {
      in: ["body"],
      isInt: { options: { min: 0, max: 100 } }
    },
    state: {
      in: ["body"],
      isIn: { options: [Object.values(EDroneState)] },
      optional: true
    }
  })

  public validateGetDronesQuery = this.validate({
    status: {
      in: ["query"],
      isIn: { options: [["available", "unavailable"]] },
      optional: true
    },
    page: {
      in: ["query"],
      isIn: { options: [["next", "prev"]] },
      optional: true,
    },
    limit: {
      in: ["query"],
      isInt: true,
      optional: true,
    },
    pt: {
      in: ["query"],
      isString: true,
      matches: {
        options: /^p\d+:\d+-\d+(?:\|p\d+:\d+-\d+)*$/, errorMessage: "Invalid page tag"
      },
      optional: true
    }
  })

  public validateDroneId = this.validate({
    id: {
      in: ["params"],
      isInt: true,
      custom: {
        options: async (id, { req }) => {
          const [exist, drone] = await this.droneAdapter.DBIsDroneIdExist(id);

          if (!exist) throw new Error("Drone not found");

          req.body.drone = drone;
        }
      }
    }
  })

  public validateDroneLoad = this.validate({
    medication_id: {
      in: ["body"],
      isInt: true,
      custom: {
        options: async (id, { req }) => {
          const drone = req.body.drone;

          if (drone.battery < 25) throw new Error("Drone battery needs to be recharged/replaced!")

          const exist = await this.droneAdapter.DBIsMedicationIdExist(id);

          if (!exist) throw new Error("Drone not found");

          const weight = exist.weight * req.body.quantity;
          const newWeight = (drone.total_weight ?? 0) + weight;

          if (drone.current_delivery_id && drone.weight_limit < newWeight) throw new Error("Weight limit exceeded")
          console.log(weight, newWeight, drone.weight_limit)
        }
      }
    },
    quantity: {
      in: ["body"],
      isInt: true,
    }
  })
}

export default DroneValidator;
