import { Expose } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import { BaseEntity } from "src/common/base/entity.base";
import { Column, Entity } from "typeorm";

@Entity({ name: "file-local", orderBy: { createdAt: "ASC" }})
export class FileLocalEntity extends BaseEntity {

    @Column({
        name: "path",
        type: "varchar",
        length: 100,
        nullable: false,
    })
    @IsNotEmpty()
    path: string;

    @Column({
        name: "size",
        type: "numeric",
    })
    @IsNotEmpty()
    @Expose()
    size: number;

    @Column({
        name: "type",
        type: "varchar",
        length: 100,
        nullable: false,
    })
    @IsNotEmpty()
    type: string;

}