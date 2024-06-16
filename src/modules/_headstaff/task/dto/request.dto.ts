import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';
import { BaseDTO } from 'src/common/base/dto.base';
import { RequestStatus } from 'src/entities/request.entity';

// export class TaskEntity extends BaseEntity {
//   @ManyToOne(() => DeviceEntity, (device) => device.id, {
//     nullable: false,
//     eager: true,
//   })
//   device: DeviceEntity;

//   @ManyToOne(() => RequestEntity, (request) => request.id, { nullable: false })
//   request: RequestEntity;

//   @OneToMany(() => IssueEntity, (issue) => issue.id, { eager: true })
//   issues: IssueEntity[];

//   @ManyToOne(() => AccountEntity, (account) => account.id)
//   @JoinColumn({ name: 'fixer_id' })
//   fixer: AccountEntity;

//   @Column({
//     name: 'fixer_note',
//     type: 'text',
//   })
//   fixerNote: string;

//   @Column({
//     name: 'name',
//     type: 'text',
//   })
//   name: string;

//   @Column({
//     name: 'status',
//     type: 'enum',
//     enum: TaskStatus,
//     default: TaskStatus.AWAITING_FIXER,
//   })
//   status: TaskStatus;

//   @Column({
//     name: 'priority',
//     type: 'boolean',
//   })
//   priority: boolean;

//   @Column({
//     name: 'operator',
//     type: 'float',
//   })
//   operator: number;

//   @Column({
//     name: 'total_time',
//     type: 'int',
//   })
//   totalTime: number;

//   @Column({
//     name: 'completed_at',
//     type: 'timestamp',
//     nullable: true,
//   })
//   completedAt: Date;

//   @Column({
//     name: 'images_verify',
//     type: 'text',
//     array: true,
//     nullable: true,
//     default: [],
//   })
//   imagesVerify: string[];

//   // get imagesVerify(): string[] {
//   //     return this._imagesVerify;
//   // }

//   // set imagesVerify(images: string[]) {
//   //     const maxLength = 3;
//   //     if (images.length > maxLength) {
//   //         throw new Error(`Độ dài của mảng không thể vượt quá ${maxLength}`);
//   //     }
//   //     this._imagesVerify = images;
//   // }

//   @Column({
//     name: 'videos_verify',
//     type: 'text',
//     nullable: true,
//   })
//   videosVerify: string;
// }

export namespace TaskRequestDto {
  export class TaskCreateDto extends BaseDTO {
    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    device: string;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    request: string;

    @ApiProperty()
    @IsOptional()
    @Expose()
    fixer?: string; // account id

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    status: RequestStatus;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    priority: boolean;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    operator: number;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    totalTime: number;

  }

  export class TaskUpdateDto extends BaseDTO {
    @ApiProperty()
    @IsOptional()
    @Expose()
    name?: string;

    @ApiProperty()
    @IsOptional()
    @Expose()
    status?: RequestStatus;

    @ApiProperty()
    @IsOptional()
    @Expose()
    priority?: boolean;

    @ApiProperty()
    @IsOptional()
    @Expose()
    operator?: number;

    @ApiProperty()
    @IsOptional()
    @Expose()
    totalTime?: number;
  }
}
