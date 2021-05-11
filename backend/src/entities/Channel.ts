import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({
  name: "channels",
})
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
