import { EDroneModel, EDroneState, ETables } from "../../Type";
import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return await knex.schema
  // table for drones
  .createTable(ETables.DRONES, (table) => {
    table.increments("id", { primaryKey: true })
    table.string("serial_number", 100).notNullable();
    table.enum("model", Object.values(EDroneModel)).notNullable();
    table.float("weight_limit").unsigned().notNullable();
    table.integer("battery").unsigned().notNullable();
    table.enum("state", Object.values(EDroneState)).defaultTo(EDroneState.IDLE)
  })
  // table for medications
  .createTable(ETables.MEDICATIONS, (table) => {
    table.increments("id", { primaryKey: true })
    table.string("name").notNullable()
    table.float("weight").notNullable().unsigned()
    table.string("code").notNullable()
    table.string("image").notNullable()
  })
  // table for each drone delivery circle
  .createTable(ETables.DELIVERY, (table) => {
    table.increments("id", { primaryKey: true })
    table.float("total_weight").unsigned()
    table.string("destination").notNullable()
    table.integer("drone_id").unsigned().notNullable()
    table.foreign("drone_id").references("id").inTable(ETables.DRONES)
  })
  // table for items in each delivery circle
  .createTable(ETables.DELIEVERY_ITEMS, (table) => {
    table.increments("id", { primaryKey: true })
    table.integer("medication_id").unsigned().notNullable()
    table.foreign("medication_id").references("id").inTable(ETables.MEDICATIONS)
    table.integer("delivery_id").unsigned().notNullable()
    table.foreign("delivery_id").references("id").inTable(ETables.DELIVERY)
    // constraint for one medication cannot be added twice:::
    table.unique(["delivery_id", "medication_id"])
  })
}

export async function down(knex: Knex): Promise<void> {
  return await knex.schema.dropTable(ETables.DELIEVERY_ITEMS).dropTable(ETables.DELIVERY).dropTable(ETables.DRONES).dropTable(ETables.MEDICATIONS);
}
