import {
  FileInterceptor,
  MemoryStorageFile,
  UploadedFile,
} from '@blazity/nest-file-fastify';
import {
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Res,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiTags
} from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import { AdminGuard } from '../auth/guards/admin.guard';
import { FileService } from './file.service';

@ApiTags('file-local')
@Controller('file-local')
export class FileController {
  constructor(
    @Inject('FILE_SERVICE') private readonly fileService: FileService,
  ) {}

  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 1024 * 1024 * 100,
      },
    }),
  )
  async uploadFile(@UploadedFile() file: MemoryStorageFile) {
    return await this.fileService.uploadFile(file);
  }

  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @Delete('remove/:path')
  async removeFile(@Param('path') path: string) {
    return await this.fileService.deleteFile(path);
  }

  @Get(':path')
  async getFile(@Param('path') path: string, @Res() res: FastifyReply) {
    const response = await this.fileService.getFile(path);
    res.header('Content-Type', response.entity.type);
    res.send(response.file)
  }
}
