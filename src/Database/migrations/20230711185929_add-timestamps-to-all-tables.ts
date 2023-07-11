import { ETables } from "../../Type";
import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema
  .alterTable(ETables.DRONES, (table) => {
    table.timestamps(true, true)
    table.timestamp("deleted_at").nullable()
  })
  .alterTable(ETables.MEDICATIONS, (table) => {
    table.timestamps(true, true)
    table.timestamp("deleted_at").nullable()
  })
  .alterTable(ETables.DELIVERY, (table) => {
    table.timestamps(true, true)
    table.timestamp("deleted_at").nullable()
  })
  .alterTable(ETables.DELIEVERY_ITEMS, (table) => {
    table.timestamps(true, true)
    table.timestamp("deleted_at").nullable()
  })
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema
  .alterTable(ETables.DRONES, (table) => {
    table.dropTimestamps()
    table.dropColumn("deleted_at")
  })
  .alterTable(ETables.MEDICATIONS, (table) => {
    table.dropTimestamps()
    table.dropColumn("deleted_at")
  })
  .alterTable(ETables.DELIVERY, (table) => {
    table.dropTimestamps()
    table.dropColumn("deleted_at")
  })
  .alterTable(ETables.DELIEVERY_ITEMS, (table) => {
    table.dropTimestamps()
    table.dropColumn("deleted_at")
  })
}

