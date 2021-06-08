import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity({
  name: "users",
})
export default class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column()
  username: string;

  @Index({ unique: true })
  @Column()
  email: string;

  @Column()
  admin: boolean;

  @Column()
  picture: string;

  public toJSON() {
    return {
      id: this.id,
      username: this.username,
      admin: this.admin
    }
  }
}
