import {
  Controller,
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

@ApiTags('file-image')
@Controller('file-image')
export class ImageController {
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
  @UseInterceptors(FileInterceptor('file', {
    limits: {
      fileSize: 1 * 1024 * 1024,
    },
  }))
  async uploadFile(@UploadedFile() file: MemoryStorageFile) {
    try {
      const fileBlob = new Blob([file.buffer], { type: file.mimetype });
      const dataForm = new FormData();
      dataForm.append('file', fileBlob);
      console.log(!file.mimetype.includes('image'));

      // check if the file is image
      if (!file.mimetype.includes('image')) {
        throw new HttpException('File is not image', 400);
      } else if (file.size > 1 * 1024 * 1024) {
        throw new HttpException('File is too large (1MB)', 400);
      } else {
        const response = await fetch(url + 'file/upload', {
          method: 'POST',
          headers: {
            'Api-Key': api_key,
          },
          body: dataForm,
        });
        const data = await response.json();
        return data.data;
      }
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
      res.header('Content-Type', 'image/png');
      res.send(image);
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }
}
