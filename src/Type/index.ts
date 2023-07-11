
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
