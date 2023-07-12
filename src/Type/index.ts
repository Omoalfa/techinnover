
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
  current_delivery_id?: number;
  current_delivery?: IDelivery;
}

export interface IMedication {
  id?: number;
  name: string;
  weight: number;
  code: string;
  image: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

export enum EDeliveryStatus {
  INITIALIZED = "INITIALIZED",
  LOADING = "LOADING",
  FULL = "FULL",
  CLOSED = "CLOSED"
}

export interface IDelivery {
  id?: number;
  total_weight: number;
  destination: string;
  drone_id?: number;
  items?: IDeliveryItems[];
  status: EDeliveryStatus;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

export interface IDeliveryItems {
  id?: number;
  medication_id?: number;
  medication?: IMedication;
  delivery_id?: number;
}
