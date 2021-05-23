import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import User from "./User";

export enum Type {
  DIRECT = "direct",
  GROUP = "group",
}

export enum Visibility {
  PUBLIC = "public",
  PROTECTED = "protected",
  PRIVATE = "private",
}

@Entity({
  name: "channels",
})
export default class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: "enum",
    enum: Type,
    default: Type.GROUP,
  })
  type: Type;

  @Column({
    type: "enum",
    enum: Visibility,
    default: Visibility.PUBLIC,
  })
  visibility: Visibility;

  @ManyToOne(() => User, {
    eager: true,
    nullable: true,
    onDelete: "CASCADE",
  })
  owner: User;

  public toRoom(): string {
    return `channel_${this.id}`;
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      visibility: this.visibility,
      owner: this.owner
        ? {
            id: this.owner.id,
            username: this.owner.username,
            admin: this.owner.admin,
          }
        : undefined,
    };
  }
}
