import 'react-native-get-random-values';
import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import {Timestamp} from './Timestamp';

@Entity()
export class Reminder extends Timestamp {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  group!: string;

  @Column()
  title!: string;

  @Column()
  message!: string;

  @Column()
  time!: Date;
}
