import { Module } from "@nestjs/common";
import { TaskModule } from "../_staff/task/task.module";
import { SparePartModule } from "./spare-part/spare-part.module";


@Module({
  imports: [
    TaskModule,
    SparePartModule
  ],
})
export class StaffModule {}