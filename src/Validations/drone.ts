import { Service } from "typedi";
import Validator from ".";
import { EDroneModel, EDroneState } from "@/Type";

@Service()
class DroneValidator extends Validator {
  public validateCreateDrone = this.validate({
    serial_number: {
      in: ["body"],
      isLength: { options: { min: 1, max: 100 }},
      isString: true,
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
}

export default DroneValidator;
