import { Module } from "@nestjs/common";
import { RequestModule } from "./request/request.module";
import { TaskModule } from "./task/task.module";
import { AccountModule } from "./account/account.module";
import { TypeErrorModule } from "./type-error/type-error.module";

@Module({
  imports: [
    RequestModule,
    TaskModule,
    AccountModule,
    TypeErrorModule,
  ],
})
export class HeadstaffModule { }