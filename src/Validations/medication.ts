import { Service } from "typedi";
import Validator from ".";
import { MedicationValidationAdapter } from "@/Database/adapters/medication";

@Service()
class MedicationValidation extends Validator {
  constructor(
    private readonly medicationAdapter: MedicationValidationAdapter
  ) {
    super()
  }

  public validateCreateMedication = this.validate({
    name: {
      in: ["body"],
      isString: true,
      matches: {
        options: /^[a-zA-Z0-9\-_]+$/
      },
      custom: {
        options: async (name) => {
          const exist = await this.medicationAdapter.DBIsMedicationExist(name, "name");

          if (exist) throw new Error("Name already in use!")
        }
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
      },
      custom: {
        options: async (code) => {
          const exist = await this.medicationAdapter.DBIsMedicationExist(code, "code");

          if (exist) throw new Error("Code already in use!")
        }
      }
    },
    image: {
      in: ["body"],
      isURL: true,
    }
  })
}

export default MedicationValidation;
