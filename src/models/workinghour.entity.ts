import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Staff } from './staff.entity';
import { Timestamp } from '@common/entities';

@Entity()
export class WorkingHours extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dayOfWeek: number;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @ManyToOne(() => Staff, (staff) => staff.workingHours)
  staff: Staff;
}
