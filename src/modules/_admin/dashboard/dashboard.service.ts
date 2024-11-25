import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RequestEntity } from "src/entities/request.entity";
import { Repository } from "typeorm";

@Injectable()
export class DashboardService {
    
    constructor(
        @InjectRepository(RequestEntity) private requestRepository: Repository<RequestEntity>,
        // @InjectRepository(Device) private accountRepository: Repository<RequestEntity>,
    ) { }
}