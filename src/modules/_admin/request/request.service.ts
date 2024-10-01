import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base/service.base';
import { RequestEntity, RequestStatus } from 'src/entities/request.entity';
import { Between, Repository } from 'typeorm';
import { RequestRequestDto } from './dto/request.dto';
import { AccountEntity, Role } from 'src/entities/account.entity';
import { DeviceEntity } from 'src/entities/device.entity';
import { NotifyEntity } from 'src/entities/notify.entity';
import { endOfDay, subMonths, subWeeks, subYears } from 'date-fns';

@Injectable()
export class RequestService extends BaseService<RequestEntity> {
  constructor(
    @InjectRepository(RequestEntity)
    private readonly requestRepository: Repository<RequestEntity>,
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
    @InjectRepository(DeviceEntity)
    private readonly deviceRepository: Repository<DeviceEntity>,
    @InjectRepository(NotifyEntity)
    private readonly notifyRepository: Repository<NotifyEntity>,
  ) {
    super(requestRepository);
  }

  async test_all() {
    return this.requestRepository.find({
      relations: [
        'device',
        'device.area',
        'device.machineModel',
        'device.machineModel.typeErrors',
        'tasks',
        'tasks.fixer',
        'requester',
        'issues',
      ],
    });
  }

  async all_filtered_sorted(
    page: number,
    limit: number,
    filterDto: RequestRequestDto.RequestAllFilteredDto,
    orderDto: RequestRequestDto.RequestAllOrderedDto,
  ) {
    const query = this.requestRepository
      .createQueryBuilder('request')
      .leftJoinAndSelect('request.device', 'device')
      .leftJoinAndSelect('device.machineModel', 'machineModel')
      .leftJoinAndSelect('device.area', 'area')
      .leftJoinAndSelect('request.requester', 'requester')
      .leftJoinAndSelect('request.issues', 'issues')
      .leftJoinAndSelect('request.tasks', 'tasks');

    // #region filter

    if (filterDto.id) {
      query.andWhere('request.id = :id', { id: filterDto.id });
    }

    if (filterDto.requester_note) {
      query.andWhere('request.requester_note = :requester_note', {
        requester_note: filterDto.requester_note,
      });
    }

    if (filterDto.status) {
      query.andWhere('request.status = :status', { status: filterDto.status });
    }

    if (filterDto.is_warranty !== undefined && filterDto.is_warranty !== null) {
      query.andWhere('request.is_warranty = :is_warranty', {
        is_warranty: filterDto.is_warranty,
      });
    }

    if (filterDto.machineModelId) {
      query.andWhere('machineModel.id = :machineModelId', {
        machineModelId: filterDto.machineModelId,
      });
    }

    if (filterDto.deviceId) {
      query.andWhere('device.id = :deviceId', { deviceId: filterDto.deviceId });
    }

    if (filterDto.areaId) {
      query.andWhere('area.id = :areaId', { areaId: filterDto.areaId });
    }

    if (filterDto.requesterName) {
      query.andWhere('requester.username = :requesterName', {
        requesterName: filterDto.requesterName,
      });
    }

    if (filterDto.createdAt) {
      query.andWhere('request.createdAt = :createdAt', {
        createdAt: filterDto.createdAt,
      });
    }

    if (filterDto.updatedAt) {
      query.andWhere('request.updatedAt = :updatedAt', {
        updatedAt: filterDto.updatedAt,
      });
    }

    if (filterDto.createdAtRangeStart) {
      query.andWhere('request.createdAt >= :createdAtRangeStart', {
        createdAtRangeStart: filterDto.createdAtRangeStart,
      });
    }

    if (filterDto.createdAtRangeEnd) {
      query.andWhere('request.createdAt <= :createdAtRangeEnd', {
        createdAtRangeEnd: filterDto.createdAtRangeEnd,
      });
    }

    if (filterDto.updatedAtRangeStart) {
      query.andWhere('request.updatedAt >= :updatedAtRangeStart', {
        updatedAtRangeStart: filterDto.updatedAtRangeStart,
      });
    }

    if (filterDto.updatedAtRangeEnd) {
      query.andWhere('request.updatedAt <= :updatedAtRangeEnd', {
        updatedAtRangeEnd: filterDto.updatedAtRangeEnd,
      });
    }

    // #endregion

    if (orderDto.order && orderDto.orderBy) {
      query.orderBy(`request.${orderDto.orderBy}`, orderDto.order);
    } else {
      query.orderBy('request.updatedAt', 'DESC');
    }

    return query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
  }

  async customHeadStaffGetAllRequest(
    userId: string,
    page: number,
    limit: number,
    status: RequestStatus,
    time: number,
  ): Promise<[RequestEntity[], number]> {
    let dateRange: { createdAt: any } = { createdAt: {} };

    // Tính toán khoảng thời gian dựa trên giá trị time
    const currentDate = new Date();
    if (time == 1) {
      // Lọc theo tuần (7 ngày trước)
      dateRange = {
        createdAt: Between(subWeeks(currentDate, 1), endOfDay(currentDate)),
      };
    } else if (time == 2) {
      // Lọc theo tháng (30 ngày trước)
      dateRange = {
        createdAt: Between(subMonths(currentDate, 1), endOfDay(currentDate)),
      };
    } else if (time == 3) {
      // Lọc theo năm (365 ngày trước)
      dateRange = {
        createdAt: Between(subYears(currentDate, 1), endOfDay(currentDate)),
      };
    }
    var account = await this.accountRepository.findOne({
      where: { id: userId },
    });
    if (!account || account.deletedAt || account.role !== Role.admin) {
      throw new HttpException('Account is not valid', HttpStatus.BAD_REQUEST);
    }
    return this.requestRepository.findAndCount({
      where: {
        status: status ? status : undefined,
        // is_rennew: false,
        ...dateRange,
      },
      relations: [
        'device',
        'device.area',
        'device.machineModel',
        'device.machineModel.typeErrors',
        'tasks',
        'tasks.fixer',
        'requester',
        'issues',
      ],
      order: {
        createdAt: 'DESC',
      },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async customHeadStaffGetOneRequest(
    userId: string,
    id: string,
  ): Promise<RequestEntity> {
    // var account = await this.accountRepository.findOne({
    //   where: { id: userId },
    // });
    // if (!account || account.deletedAt || account.role !== Role.admin) {
    //   throw new HttpException('Account is not valid', HttpStatus.BAD_REQUEST);
    // }
    // // update status notify
    // await this.notifyRepository.update(
    //   {
    //     requestId: id,
    //   },
    //   {
    //     status: true,
    //   },
    // );
    return this.requestRepository.findOne({
      where: { id },
      relations: [
        'device',
        'device.area',
        'device.machineModel',
        'tasks',
        'tasks.fixer',
        'tasks.issues',
        'requester',
        'issues',
        'issues.task',
        'issues.typeError',
        'issues.issueSpareParts',
        'issues.issueSpareParts.sparePart',
        'feedback',
      ],
    });
  }

  async updateStatus(
    userId: string,
    id: string,
    data: RequestRequestDto.RequestUpdateDto,
  ): Promise<RequestEntity> {
    const account = await this.accountRepository.findOne({
      where: { id: userId },
    });
    return await this.requestRepository.save({ id, ...data, checker: account });
  }
}
