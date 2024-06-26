import { Module } from "@nestjs/common";
import { TaskModule } from "../_staff/task/task.module";
import { DeviceModule } from "./device/device.module";


@Module({
  imports: [
    TaskModule,
    DeviceModule,
  ],
})
export class StaffModule {}