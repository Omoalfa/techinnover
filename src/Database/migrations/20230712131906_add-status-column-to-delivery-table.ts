import { EDeliveryStatus, ETables } from "../../Type";
import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return await knex.schema.alterTable(ETables.DELIVERY, (table) => {
    table.enum("status", Object.values(EDeliveryStatus)).defaultTo(EDeliveryStatus.INITIALIZED)
  })
  .alterTable(ETables.DRONES, (table) => {
    table.integer("current_delivery_id").unsigned()
    table.foreign("current_delivery_id").references("id").inTable(ETables.DELIVERY)
  })
  .alterTable(ETables.DELIEVERY_ITEMS, (table) => {
    table.integer("quantity").unsigned()
  })
}


export async function down(knex: Knex): Promise<void> {
  return await knex.schema.alterTable(ETables.DELIVERY, (table) => {
    table.dropColumn("status")
  })
  .alterTable(ETables.DRONES, (table) => {
    table.dropForeign("current_delivery_id")
    table.dropColumn("current_delivery_id")
  })
  .alterTable(ETables.DELIEVERY_ITEMS, (table) => {
    table.dropColumn("quantity")  
  })
}
