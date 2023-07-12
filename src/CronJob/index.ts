import { Service } from "typedi";
import cron from "node-cron";
import { fetchBatterStatus } from "./helpers";
import { CronDroneAdapters } from "@/Database/adapters/drones";
import batteryLogger from "@/Logger/batteryLogger";

@Service()
class CronJobs {
  constructor (
    private readonly droneAdapter: CronDroneAdapters
  ) {}

  public fetchBatterStatusJob = cron.schedule("*/30 * * * *", async () => {
    batteryLogger.debug("battery logger started!!!!")
    
    try {
      // fetch all drones::::
      const drones = await this.droneAdapter.getAllDrones();

      await Promise.all(drones.map(async (drone) => {
        //// fetch battery status from the drone:::
        const value = fetchBatterStatus(drone.serial_number);

        /// save to database:::
        this.droneAdapter.updateDroneBattery(drone.id, value);

        /// send to log stream:::
        batteryLogger.info(`drone ${drone.serial_number} is currently at ${value}%`)
      }))

      batteryLogger.debug("battery logger completed!!!");     
    } catch (error) {
      batteryLogger.error(error);
    }
  })
}

export default CronJobs;
