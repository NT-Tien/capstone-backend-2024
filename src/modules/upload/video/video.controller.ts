import {
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import {
  FileInterceptor,
  MemoryStorageFile,
  UploadedFile,
} from '@blazity/nest-file-fastify';
import { FastifyReply } from 'fastify';
import * as dotenv from 'dotenv';
import { AdminGuard } from 'src/modules/auth/guards/admin.guard';

dotenv.config();

const url = process.env.FILE_PATH_STORAGE;
const api_key = process.env.FILE_API_KEY;

@ApiTags('file-video')
@Controller('file-video')
export class VideoController {
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
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: MemoryStorageFile) {
    try {
      const fileBlob = new Blob([file.buffer], { type: file.mimetype });
      const dataForm = new FormData();
      dataForm.append('file', fileBlob);
      // check if the file is video
      if (!file.mimetype.includes('video')) {
        throw new HttpException('File is not video', 400);
      }
      // check if the file is larger than 50MB
      if (file.size > 50 * 1024 * 1024) {
        throw new HttpException('File is too large (50MB)', 400);
      } 
      const response = await fetch(url + 'file/upload', {
        method: 'POST',
        headers: {
          'Api-Key': api_key,
        },
        body: dataForm,
      });
      const data = await response.json();
      return data.data;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  // get image to show

  @Get(':path')
  async showFile(@Param('path') path: string, @Res() res: FastifyReply) {
    try {
      const response = await fetch(url + '/' + path, {
        method: 'GET',
        headers: {
          'Api-Key': api_key,
        },
      });
      const buffer = await response.arrayBuffer();
      const image = Buffer.from(buffer);
      // video type
      res.header('Content-Type', 'video/mp4');
      res.send(image);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
