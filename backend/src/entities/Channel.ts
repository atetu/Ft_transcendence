import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import * as bcrypt from "bcrypt";
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

  @Column({
    nullable: true,
  })
  passwordHash: string;

  password?: string;

  async updatePasswordHash() {
    if (this.isProtected()) {
      if (this.password !== undefined) {
        const salt = await bcrypt.genSalt(10);
        this.passwordHash = await bcrypt.hash(this.password, salt);
      }
    } else {
      this.passwordHash = null;
    }
  }

  public async checkPassword(password: string) {
    if (!this.isProtected()) {
      return true;
    }

    return await bcrypt.compare(password, this.passwordHash);
  }

  public toRoom(): string {
    return `channel_${this.id}`;
  }

  public isPublic(): boolean {
    return this.visibility === Visibility.PUBLIC;
  }

  public isProtected(): boolean {
    return this.visibility === Visibility.PROTECTED;
  }

  public isPrivate(): boolean {
    return this.visibility === Visibility.PRIVATE;
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

  static Type = Visibility;
  static Visibility = Visibility;
}
