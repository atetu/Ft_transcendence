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

  @Column({ default: false })
  otp: boolean;

  @Column({ nullable: true })
  otpSecret?: string;

  @Column({ default: false })
  doneFirstStep: boolean;

  public toJSON() {
    return {
      id: this.id,
      username: this.username,
      admin: this.admin,
      picture: this.picture,
      doneFirstStep: this.doneFirstStep ? undefined : false,
    };
  }

  public is(other: User) {
    return this.id === other?.id;
  }
}
