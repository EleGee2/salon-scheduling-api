import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Staff } from '../../staff/entities/staff.entity';
import { Timestamp } from '@common/entities';

@Entity()
export class Service extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  duration: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ default: 0 })
  buffer_time: number;

  @ManyToMany(() => Staff, (staff) => staff.services)
  staff: Staff[];
}
