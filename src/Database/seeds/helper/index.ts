import { EDroneModel, EDroneState, IDrone, IMedication } from "../../../Type";
import { customAlphabet } from "nanoid";

const serialNumberGenerator = () => Math.floor(10000000 + Math.random() * 90000000).toString()

const randomCode = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ_0123456789", 10)
const randomName = customAlphabet("ABCDEFGHIJKLMabcdefghijklm_-1234567890", 12)


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

export const generateMedicationData = (count: number) => {
  let medications: IMedication[] = [];

  for (let i = 0; i < count; i++) {
    medications.push({
      code: randomCode(),
      name: randomName(),
      weight: randomWeight(),
      image: "https://res.cloudinary.com/omoalfa/image/upload/v1682429758/roiyrw5fvz0hb1nmg6jj.jpg"
    })
  }

  return medications;
}
