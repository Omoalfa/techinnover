import { ETables } from "../../Type";
import { Knex } from "knex";
import { generateDroneData } from "./helper";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex(ETables.DRONES).del();

    const droneData = generateDroneData(40);
    // Inserts seed entries
    await knex(ETables.DRONES).insert(droneData);
};
