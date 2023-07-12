import { ETables, IMedication } from "@/Type";
import knex from "@Database/index";
import { Service } from "typedi";

@Service()
class MedicationAdapter {
  public DBCreateMedication = async (data: IMedication) => {
    try {
      const medication = await knex.table(ETables.MEDICATIONS).insert(data).returning("*")

      return medication;
    } catch (error) {
      throw error;
    }
  }

  public DBGetMedications = async (search?: string) => {
    try {
      const query = knex.select("*").from(ETables.MEDICATIONS)

      if (search) {
        query.whereILike("code", `%${search}%`)
        query.orWhereILike("name", `%${search}%`)
      }

      const medications = await query;

      return medications;
    } catch (error) {
      throw error;
    }
  }
}

export default MedicationAdapter;
