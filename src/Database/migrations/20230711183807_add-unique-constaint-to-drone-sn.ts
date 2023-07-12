import { ETables } from "../../Type";
import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return await knex.schema.alterTable(ETables.DRONES, (table) => {
    table.unique(["serial_number"])
  })
}


export async function down(knex: Knex): Promise<void> {
  return await knex.schema.alterTable(ETables.DRONES, (table) => {
    table.dropUnique(["serial_number"])
  })
}
