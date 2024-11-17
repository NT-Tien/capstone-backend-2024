import { HttpException, Injectable } from '@nestjs/common';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { MemoryStorageFile } from '@blazity/nest-file-fastify';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileLocalEntity } from 'src/entities/file-local.entity';
import { BaseService } from 'src/common/base/service.base';
import * as fs from 'fs';

@Injectable()
export class FileService extends BaseService<FileLocalEntity> {
  private static readonly FILE_PATH = join(
    __dirname,
    '..',
    '..',
    '..',
    'public/uploads',
  );

  constructor(
    @InjectRepository(FileLocalEntity)
    private readonly fileRepository: Repository<FileLocalEntity>,
  ) {
    super(fileRepository);
  }

  async getFiles() {
    return await this.fileRepository.find();
  }

  private static getFilePath(...path: string[]) {
    return join(FileService.FILE_PATH, ...path);
  }

  // upload file
  async uploadFile(file: MemoryStorageFile) {
    // check file type
    // if (!file.mimetype.startsWith('image/')) {
    //   throw new HttpException('File type is not image', 400);
    // }
    // write file to folder uploads
    const fileName = uuidv4() + '.' + file.mimetype.split('/')[1];
    // check folder exist
    console.log('dirname', __dirname);

    if (!fs.existsSync(join(__dirname, '..', '..', '..', 'public/uploads'))) {
      fs.mkdirSync(join(__dirname, '..', '..', '..', 'public/uploads'));
    }
    // write file
    fs.writeFileSync(
      join(__dirname, '..', '..', '..', 'public/uploads', fileName),
      file.buffer,
    );
    // get file size
    const stats = fs.statSync(
      join(__dirname, '..', '..', '..', 'public/uploads', fileName),
    );
    const fileSizeInBytes = stats.size;
    // create new file
    return await this.fileRepository.save({
      path: fileName,
      size: fileSizeInBytes,
      type: file.mimetype,
    });
  }

  async deleteFile(path: string) {
    try {
      if (
        fs.existsSync(join(__dirname, '..', '..', '..', 'public/uploads', path))
      ) {
        fs.unlinkSync(
          join(__dirname, '..', '..', '..', 'public/uploads', path),
        );
        return this.fileRepository.delete({ path: path });
      } else {
        console.log('file not exist', path);
      }
    } catch (error) {
      console.log('delete file error', error);
    }
  }

  async getFile(path: string) {
    const filePath = FileService.getFilePath(path);

    try {
      const fileEntity = await this.fileRepository.findOneOrFail({
        where: {
          path,
        },
      });
      if (fs.existsSync(filePath)) {
        const file = fs.readFileSync(filePath);
        return {
          file,
          entity: fileEntity,
        };
      } else {
        throw new HttpException('File not found', 404);
      }
    } catch (e) {
      throw new HttpException('File not found', 404);
    }
  }
}
