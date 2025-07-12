import { Timestamp } from '@common/entities';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Staff } from '../../staff/entities/staff.entity';

@Entity()
export class Appointment extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  staffId: number;

  @Column()
  serviceId: number;

  @Column({ type: 'timestamp with time zone' })
  startTime: Date;

  @Column({ type: 'timestamp with time zone' })
  endTime: Date;

  @ManyToOne(() => Staff, (staff) => staff.appointments)
  staff: Staff;
}
