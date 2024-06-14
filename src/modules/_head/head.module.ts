import { Module } from "@nestjs/common";
import { RequestModule } from "./request/request.module";

@Module({
    imports: [
        RequestModule,
    ],
})
export class HeadModule {}