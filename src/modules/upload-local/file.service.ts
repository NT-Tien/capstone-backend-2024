import { HttpException, Injectable } from "@nestjs/common";
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { MemoryStorageFile } from "@blazity/nest-file-fastify";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FileLocalEntity } from "src/entities/file-local.entity";
import { BaseService } from "src/common/base/service.base";

@Injectable()
export class FileService extends BaseService<FileLocalEntity> {
  constructor(
    @InjectRepository(FileLocalEntity) private readonly fileRepository: Repository<FileLocalEntity>,
  ) {
    super(fileRepository);
  }

  async getFiles() {
    return await this.fileRepository.find();
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

    if (!require('fs').existsSync(join(__dirname, '..', '..', '..', 'uploads'))) {
      require('fs').mkdirSync(join(__dirname, '..', '..', '..', 'uploads'));
    }
    // write file
    require('fs').writeFileSync(join(__dirname, '..', '..', '..', 'uploads', fileName), file.buffer);
    // get file size
    var stats = require('fs').statSync(join(__dirname, '..', '..', '..', 'uploads', fileName));
    var fileSizeInBytes = stats.size;
    // create new file
    return await this.fileRepository.save({ path: fileName, size: fileSizeInBytes, type: file.mimetype });
  }

  async deleteFile(path: string) {
    try {
      if (require('fs').existsSync(join(__dirname, '..', '..', '..', 'uploads', path))) {
        await require('fs').unlinkSync(join(__dirname, '..', '..', '..', 'uploads', path));
        return this.fileRepository.delete({ path: path });
      } else {
        console.log('file not exist', path);
      }
    } catch (error) {
      console.log('delete file error', error);

    }
  }
}