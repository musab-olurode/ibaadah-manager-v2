import 'react-native-get-random-values';
import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import {ActivityCategory} from '../../utils/activities';
import {Timestamp} from './Timestamp';

@Entity()
export class Activity extends Timestamp {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({type: 'int'})
  icon!: number;

  @Column({type: 'int'})
  order!: number;

  @Column()
  group!: string;

  @Column({type: 'varchar'})
  category!: ActivityCategory;

  @Column()
  title!: string;

  @Column({default: false})
  completed!: boolean;
}
