import { ETables } from "../../Type";
import { Knex } from "knex";
import { generateMedicationData } from "./helper";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex(ETables.MEDICATIONS).del();

    const medicationData = generateMedicationData(10);
    // Inserts seed entries
    await knex(ETables.MEDICATIONS).insert(medicationData);
};
