import { Module } from "@nestjs/common";
import { RequestModule } from "./request/request.module";
import { TaskModule } from "./task/task.module";
import { AccountModule } from "./account/account.module";

@Module({
  imports: [
    RequestModule,
    TaskModule,
    AccountModule,
  ],
})
export class HeadstaffModule { }