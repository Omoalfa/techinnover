import { ETables } from "../../Type";
import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return await knex.schema.alterTable(ETables.MEDICATIONS, (table) => {
    table.unique(["name"])
    table.unique(["code"])
  })
}


export async function down(knex: Knex): Promise<void> {
  return await knex.schema.alterTable(ETables.MEDICATIONS, (table) => {
    table.dropUnique(["name"])
    table.dropUnique(["code"])
  })
}
