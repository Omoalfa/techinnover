import { DBClearTable } from "@/Database";
import { ETables } from "@/Type";

export const clearTable = async (table: ETables) => {
  await DBClearTable(table);
}

