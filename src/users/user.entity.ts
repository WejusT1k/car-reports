import {
  AfterInsert,
  AfterUpdate,
  AfterRemove,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Report } from '../reports/report.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ default: true })
  admin: boolean;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @AfterInsert()
  logInsert() {
    console.log('user was added with id: ', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('user was updated with id: ', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('user was removed with id: ', this.id);
  }
}
