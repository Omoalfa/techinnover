import { EDroneModel, EDroneState, IDrone } from "../../../Type";

const serialNumberGenerator = () => Math.floor(10000000 + Math.random() * 90000000).toString()

const randomWeight = () => Math.floor(100 + Math.random() * 399)

export const generateDroneData = (count: number) => {
  let drones: IDrone[] = [];
  for (let i = 0; i < count; i++) {
    drones.push({
      serial_number: serialNumberGenerator(),
      state: EDroneState.IDLE,
      model: EDroneModel.HEAVYWEIGHT,
      weight_limit: randomWeight(),
      battery: 90,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    })
  }

  return drones;
}
