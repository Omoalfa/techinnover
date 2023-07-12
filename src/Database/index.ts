import {  DB_URL, NODE_ENV, TEST_DB_URL } from '@/Config';
import { ETables } from '@/Type';
import { knex as knexObject } from 'knex';

const knexConfig = {
  client: 'pg',
  connection: NODE_ENV === 'test' ? TEST_DB_URL : DB_URL,
  pool: {
    min: 2,
    max: 10
  },
  timezone: 'UTC'
}

const knex = knexObject(knexConfig);

export const DBClearTable = async (table: ETables) => {
  await knex.table(table).del()
}

export default knex;