import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/common/base/service.base";
import { NotifyEntity } from "src/entities/notify.entity";
import { Repository } from "typeorm";

@Injectable()
export class NotifyService extends BaseService<NotifyEntity> {
    constructor(
        @InjectRepository(NotifyEntity)
        private readonly notifyRepository: Repository<NotifyEntity>,
    ) {
        super(notifyRepository);
    }
}