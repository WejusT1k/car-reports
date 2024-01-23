import {
  AfterInsert,
  AfterUpdate,
  AfterRemove,
  Entity,
  Column,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

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
