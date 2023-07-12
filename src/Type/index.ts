
export enum ETables {
  DRONES = "drones",
  MEDICATIONS = "medications",
  DELIVERY = "delivery",
  DELIEVERY_ITEMS = "delivery_items"
}

export enum EDroneModel {
  LIGHTWEIGHT = "Lightweight",
  MIDDLEWEIGHT = "Middleweight",
  CRUISERWEIGHT = "Cruiserweight",
  HEAVYWEIGHT = "Heavyweight"
}

export enum EDroneState {
  IDLE = "idle",
  LOADING = "loading",
  LOADED = "loaded",
  DELIVERING = "delivering",
  DELIVERED = "delivered",
  RETURNING = "returning",
}

export interface IDrone {
  id?: number;
  serial_number: string;
  model: EDroneModel;
  weight_limit: number;
  battery: number;
  state: EDroneState;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}
