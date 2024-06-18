import { Module } from "@nestjs/common";
import { RequestModule } from "./request/request.module";
import { TaskModule } from "./task/task.module";
import { AccountModule } from "./account/account.module";
import { DeviceModule } from "./device/device.module";

@Module({
  imports: [
    RequestModule,
    TaskModule,
    AccountModule,
    DeviceModule,
  ],
})
export class HeadstaffModule { }