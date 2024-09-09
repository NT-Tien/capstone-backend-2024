import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base/service.base';
import { DeviceEntity } from 'src/entities/device.entity';
import { RequestStatus } from 'src/entities/request.entity';
import { TaskStatus } from 'src/entities/task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DeviceService extends BaseService<DeviceEntity> {
  constructor(
    @InjectRepository(DeviceEntity)
    private readonly deviceRepository: Repository<DeviceEntity>,
  ) {
    super(deviceRepository);
  }

  // get all with relations
  async getAllWithRelations(): Promise<DeviceEntity[]> {
    return this.deviceRepository.find({
      relations: ['area', 'machineModel'],
    });
  }

  // get one with relations
  async getOneWithRelations(id: string): Promise<DeviceEntity> {
    return this.deviceRepository.findOne({
      where: { id },
      relations: ['area', 'machineModel'],
    });
  }

  async getAllInfoDeviceByAreaId(areaId: string) {
    return Promise.all([
      this.deviceRepository.find({
        where: {
          area: {
            id: areaId,
          },
        },
        relations: [
          'requests',
          'requests.tasks',
        ],
      }),
    ]).then(([devices]) => {
      let total_requests = 0;
      let total_tasks = 0;
      let total_devices = devices.length;

      // status of requests
      let pending_requests = 0;
      let checked_requests = 0;
      let approved_requests = 0;
      let in_progress_requests = 0;
      let closed_requests = 0;
      let head_confirm_requests = 0;
      let rejected_requests = 0;

      // status of tasks
      let awaiting_spare_spart = 0;
      let awaiting_fixer = 0;
      let assigned = 0;
      let in_progress = 0;
      let completed = 0;
      let head_staff_confirm = 0;
      let cancelled = 0;
      let staff_request_cancelled = 0;
      let head_staff_confirm_staff_request_cancelled = 0;
      let close_task_request_cancelled = 0;

      devices.forEach(device => {
        device.requests.forEach(request => {
          total_requests++;
          switch (request.status) {
            case RequestStatus.PENDING:
              pending_requests++;
              break;
            case RequestStatus.CHECKED:
              checked_requests++;
              break;
            case RequestStatus.APPROVED:
              approved_requests++;
              break;
            case RequestStatus.IN_PROGRESS:
              in_progress_requests++;
              break;
            case RequestStatus.CLOSED:
              closed_requests++;
              break;
            case RequestStatus.HEAD_CONFIRM:
              head_confirm_requests++;
              break;
            case RequestStatus.REJECTED:
              rejected_requests++;
              break;
          }
          request.tasks.forEach(task => {
            total_tasks++;
            switch (task.status) {
              case TaskStatus.AWAITING_SPARE_SPART:
                awaiting_spare_spart++;
                break;
              case TaskStatus.AWAITING_FIXER:
                awaiting_fixer++;
                break;
              case TaskStatus.ASSIGNED:
                assigned++;
                break;
              case TaskStatus.IN_PROGRESS:
                in_progress++;
                break;
              case TaskStatus.COMPLETED:
                completed++;
                break;
              case TaskStatus.HEAD_STAFF_CONFIRM:
                head_staff_confirm++;
                break;
              case TaskStatus.CANCELLED:
                cancelled++;
                break;
              case TaskStatus.STAFF_REQUEST_CANCELLED:
                staff_request_cancelled++;
                break;
              case TaskStatus.HEAD_STAFF_CONFIRM_STAFF_REQUEST_CANCELLED:
                head_staff_confirm_staff_request_cancelled++;
                break;
              case TaskStatus.CLOSE_TASK_REQUEST_CANCELLED:
                close_task_request_cancelled++;
                break;
            }
          });
        });
      });
      return {
        total_requests,
        total_tasks,
        total_devices,
        request: {
          pending_requests,
          checked_requests,
          approved_requests,
          in_progress_requests,
          closed_requests,
          head_confirm_requests,
          rejected_requests,
        },
        task: {
          awaiting_spare_spart,
          awaiting_fixer,
          assigned,
          in_progress,
          completed,
          head_staff_confirm,
          cancelled,
          staff_request_cancelled,
          head_staff_confirm_staff_request_cancelled,
          close_task_request_cancelled,
        }
      };
    });
  }
}

// {
//   "data": [
//     [
//       {
//         "id": "7d9085c9-6b2b-4f41-b905-f6d9431e62b6",
//         "createdAt": "2024-09-08T09:14:40.881Z",
//         "updatedAt": "2024-09-08T09:14:40.881Z",
//         "deletedAt": null,
//         "positionX": 9,
//         "positionY": 4,
//         "description": "Máy vắt sổ dạng phẳng",
//         "operationStatus": 3920,
//         "isWarranty": null,
//         "status": true,
//         "requests": []
//       },
//       {
//         "id": "0fee3196-45c5-4723-9bf2-6538e95451e4",
//         "createdAt": "2024-09-08T09:14:40.881Z",
//         "updatedAt": "2024-09-08T09:14:40.881Z",
//         "deletedAt": null,
//         "positionX": 4,
//         "positionY": 9,
//         "description": "Máy cắt viền",
//         "operationStatus": 3421,
//         "isWarranty": null,
//         "status": false,
//         "requests": []
//       },
//       {
//         "id": "63212dbb-9db4-43de-8fab-a0eb0b8c5a11",
//         "createdAt": "2024-09-08T09:14:40.881Z",
//         "updatedAt": "2024-09-08T09:14:40.881Z",
//         "deletedAt": null,
//         "positionX": 9,
//         "positionY": 10,
//         "description": "Máy may dấu mũi",
//         "operationStatus": 4235,
//         "isWarranty": null,
//         "status": true,
//         "requests": []
//       },
//       {
//         "id": "2865ad49-2a51-4aec-86f0-c3595684d938",
//         "createdAt": "2024-09-08T09:14:40.881Z",
//         "updatedAt": "2024-09-08T09:14:40.881Z",
//         "deletedAt": null,
//         "positionX": 9,
//         "positionY": 4,
//         "description": "Máy vắt sổ dạng phẳng",
//         "operationStatus": 3920,
//         "isWarranty": null,
//         "status": true,
//         "requests": []
//       },
//       {
//         "id": "be53aabe-1bd7-465d-8b8f-ec01e7930a42",
//         "createdAt": "2024-09-08T09:14:40.881Z",
//         "updatedAt": "2024-09-08T09:14:40.881Z",
//         "deletedAt": null,
//         "positionX": 4,
//         "positionY": 9,
//         "description": "Máy cắt viền",
//         "operationStatus": 3421,
//         "isWarranty": null,
//         "status": false,
//         "requests": []
//       },
//       {
//         "id": "664b8db3-045e-4de8-a5e8-947cb0046578",
//         "createdAt": "2024-09-08T09:14:40.881Z",
//         "updatedAt": "2024-09-08T09:14:40.881Z",
//         "deletedAt": null,
//         "positionX": 9,
//         "positionY": 10,
//         "description": "Máy may dấu mũi",
//         "operationStatus": 4235,
//         "isWarranty": null,
//         "status": true,
//         "requests": []
//       },
//       {
//         "id": "d8b37130-d000-45bd-baf3-e563eb9dc315",
//         "createdAt": "2024-09-08T09:14:40.881Z",
//         "updatedAt": "2024-09-08T09:14:40.881Z",
//         "deletedAt": null,
//         "positionX": 3,
//         "positionY": 1,
//         "description": "Máy đính cườm",
//         "operationStatus": 8643,
//         "isWarranty": null,
//         "status": false,
//         "requests": []
//       },
//       {
//         "id": "b1c7cc7b-a417-4143-8bb4-3eccb5c969f8",
//         "createdAt": "2024-09-08T09:14:40.881Z",
//         "updatedAt": "2024-09-08T09:14:40.881Z",
//         "deletedAt": null,
//         "positionX": 3,
//         "positionY": 3,
//         "description": "Máy may thêu",
//         "operationStatus": 4567,
//         "isWarranty": null,
//         "status": true,
//         "requests": []
//       },
//       {
//         "id": "bfe915fa-a492-4260-b374-00924f419b24",
//         "createdAt": "2024-09-08T09:14:40.881Z",
//         "updatedAt": "2024-09-08T09:14:40.881Z",
//         "deletedAt": null,
//         "positionX": 8,
//         "positionY": 8,
//         "description": "Máy may đa năng",
//         "operationStatus": 1234,
//         "isWarranty": null,
//         "status": false,
//         "requests": []
//       },
//       {
//         "id": "843a16d8-aff9-41c1-8732-6db20e51aeb7",
//         "createdAt": "2024-09-08T09:14:40.881Z",
//         "updatedAt": "2024-09-08T09:14:40.881Z",
//         "deletedAt": null,
//         "positionX": 3,
//         "positionY": 4,
//         "description": "Máy may viền tay áo",
//         "operationStatus": 6789,
//         "isWarranty": null,
//         "status": false,
//         "requests": []
//       },
//       {
//         "id": "ac660f4c-e5c9-4742-9a12-68583b67d9e8",
//         "createdAt": "2024-09-08T09:14:40.881Z",
//         "updatedAt": "2024-09-08T09:14:40.881Z",
//         "deletedAt": null,
//         "positionX": 8,
//         "positionY": 9,
//         "description": "Máy may nhanh",
//         "operationStatus": 3456,
//         "isWarranty": null,
//         "status": false,
//         "requests": []
//       },
//       {
//         "id": "64f0101a-2276-4e95-8e33-6ae09c9ff8c5",
//         "createdAt": "2024-09-08T09:14:40.881Z",
//         "updatedAt": "2024-09-08T09:14:40.881Z",
//         "deletedAt": null,
//         "positionX": 4,
//         "positionY": 6,
//         "description": "Máy may vải lót",
//         "operationStatus": 8901,
//         "isWarranty": null,
//         "status": true,
//         "requests": []
//       },
//       {
//         "id": "92901dd4-e38c-4989-bc43-842136a2eb4a",
//         "createdAt": "2024-09-08T09:14:40.881Z",
//         "updatedAt": "2024-09-08T09:14:40.881Z",
//         "deletedAt": null,
//         "positionX": 9,
//         "positionY": 1,
//         "description": "Máy may vải cotton",
//         "operationStatus": 5678,
//         "isWarranty": null,
//         "status": false,
//         "requests": []
//       },
//       {
//         "id": "c5c9c774-3ee9-4ec8-86db-f9ecf009d6e5",
//         "createdAt": "2024-09-08T09:14:40.881Z",
//         "updatedAt": "2024-09-08T09:14:40.881Z",
//         "deletedAt": null,
//         "positionX": 4,
//         "positionY": 7,
//         "description": "Máy may chuyên dụng cho vải lụa",
//         "operationStatus": 2345,
//         "isWarranty": null,
//         "status": false,
//         "requests": []
//       },
//       {
//         "id": "94f9380e-caf0-4eac-a048-81651e7e9e25",
//         "createdAt": "2024-09-08T09:14:40.881Z",
//         "updatedAt": "2024-09-08T09:14:40.881Z",
//         "deletedAt": null,
//         "positionX": 9,
//         "positionY": 2,
//         "description": "Máy may vải đệm",
//         "operationStatus": 7890,
//         "isWarranty": null,
//         "status": false,
//         "requests": []
//       },
//       {
//         "id": "8fa7481f-6c7b-4983-958c-24c1fbbc7780",
//         "createdAt": "2024-09-08T09:14:40.881Z",
//         "updatedAt": "2024-09-08T09:14:40.881Z",
//         "deletedAt": null,
//         "positionX": 4,
//         "positionY": 8,
//         "description": "Máy may vải chiffon",
//         "operationStatus": 4567,
//         "isWarranty": null,
//         "status": true,
//         "requests": []
//       },
//       {
//         "id": "90bb1bdb-48d0-4395-a9e5-ff02d509af7a",
//         "createdAt": "2024-09-08T09:14:40.881Z",
//         "updatedAt": "2024-09-08T09:14:40.881Z",
//         "deletedAt": null,
//         "positionX": 9,
//         "positionY": 3,
//         "description": "Máy may với chức năng bọc",
//         "operationStatus": 1234,
//         "isWarranty": null,
//         "status": true,
//         "requests": [
//           {
//             "id": "1e42bd6e-6407-452c-b628-128392b5ae98",
//             "createdAt": "2024-09-08T09:14:40.881Z",
//             "updatedAt": "2024-09-08T10:08:15.587Z",
//             "deletedAt": null,
//             "requester_note": "Điện áp không ổn định gây ra sự cố",
//             "checker_date": null,
//             "checker_note": null,
//             "status": "APPROVED",
//             "type": "FIX",
//             "level": null,
//             "is_seen": true,
//             "is_warranty": false,
//             "return_date_warranty": null,
//             "is_rennew": false,
//             "tasks": [
//               {
//                 "id": "12c2acea-adfb-418e-a1eb-440e2ba654d5",
//                 "createdAt": "2024-09-08T10:08:56.471Z",
//                 "updatedAt": "2024-09-08T10:08:56.471Z",
//                 "deletedAt": null,
//                 "fixerNote": null,
//                 "fixerDate": null,
//                 "name": "080924_Q3_Elna-eXcellence-720PRO_E55",
//                 "status": "AWAITING_FIXER",
//                 "priority": false,
//                 "operator": 0,
//                 "totalTime": 120,
//                 "completedAt": null,
//                 "imagesVerify": [],
//                 "videosVerify": null,
//                 "confirmReceipt": false,
//                 "confirmReceiptBY": null,
//                 "confirmRecieveBy": null,
//                 "confirm_recieve_return_spare_part": null,
//                 "stockkeeperNote": null,
//                 "stockkeeperNoteId": null
//               }
//             ]
//           }
//         ]
//       },
//       {
//         "id": "0a95739c-bbfb-4715-a2d0-fcaab084a231",
//         "createdAt": "2024-09-08T09:14:40.881Z",
//         "updatedAt": "2024-09-08T09:14:40.881Z",
//         "deletedAt": null,
//         "positionX": 4,
//         "positionY": 9,
//         "description": "Máy may vải chống thấm",
//         "operationStatus": 6789,
//         "isWarranty": null,
//         "status": true,
//         "requests": []
//       }
//     ],
//     18
//   ],
//   "message": "Success",
//   "statusCode": 200
// }
