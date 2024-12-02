import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({
    name: "SEQUENCE"
})
export class SequenceEntity {
    @PrimaryColumn({})
    name: string;

    @Column({
        default: 0,
        type: "int",
    })
    value: number;
}