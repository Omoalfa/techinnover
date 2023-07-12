import { Service } from "typedi";
import Validator from ".";

@Service()
class MedicationValidation extends Validator {
  constructor() {
    super()
  }

  public validateCreateMedication = this.validate({
    name: {
      in: ["body"],
      isString: true,
      matches: {
        options: /^[a-zA-Z0-9\-_]+$/
      }
    },
    weight: {
      in: ["body"],
      isFloat: { options: { max: 500 }}
    },
    code: {
      in: ["body"],
      isString: true,
      matches: {
        options: /^[A-Z0-9_]+$/
      }
    },
    image: {
      in: ["body"],
      isURL: true,
    }
  })
}

export default MedicationValidation;
