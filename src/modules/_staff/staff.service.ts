import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AccountEntity, Role } from '../../entities/account.entity';
import { TaskEntity } from 'src/entities/task.entity';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly repositoryTask: Repository<TaskEntity>,

  ) {}
/*
1. Get current task
2. Get Task list order by <priority -> report time> 
3. Filter Task by status
4. Get Task detail by ID
5. Check receipt spare part in warehouse
6. Report new Task by old issue check
7. FinishRepair
8. Return sparepart check and Cancel Repairs issue
*/


/**
1. Get List request take sp
2. Request  detail
3. Confirm taken
4. Check confirm return
 */

}
