import { Module } from "@nestjs/common";
import { FileController } from "./file.controller";
import { FileService } from "./file.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FileLocalEntity } from "src/entities/file-local.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([FileLocalEntity])
    ],
    controllers: [FileController],
    providers: [
        {
            provide: 'FILE_SERVICE',
            useClass: FileService
        },
    ],
})
export class FileLocalModule { }