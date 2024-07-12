import { Controller, Delete, Get, Inject, Param, Post, Req, Res, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiHeader, ApiTags } from "@nestjs/swagger";
import { FileInterceptor, MemoryStorageFile, UploadedFile } from "@blazity/nest-file-fastify";
import { FileService } from "./file.service";
import { AdminGuard } from "../auth/guards/admin.guard";


@ApiTags('file-local')
@UseGuards(AdminGuard)
@Controller('file-local')
export class FileController {

    constructor(
        @Inject('FILE_SERVICE') private readonly fileService: FileService,
    ) { }

    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                }
            },
        },
    })
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', {
        limits: {
            fileSize: 1024 * 1024 * 100,
        },
    }))
    async uploadFile(
        @UploadedFile() file: MemoryStorageFile,
    ) {
        return await this.fileService.uploadFile(file);
    }

    @ApiBearerAuth()
    @Delete('remove/:path')
    async removeFile(
        @Param('path') path: string,
    ) {
        return await this.fileService.deleteFile(path);
    }

} 