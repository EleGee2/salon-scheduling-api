import { Entity, PrimaryGeneratedColumn, Column, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { Timestamp } from '@common/entities';
import { Service } from '../../service/entities/service.entity';
import { Appointment } from '../../appointment/entities/appointment.entity';
import { WorkingHours } from './workinghour.entity';

@Entity()
export class Staff extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: 'UTC' })
  timezone: string;

  @OneToMany(() => WorkingHours, (workingHours) => workingHours.staff)
  workingHours: WorkingHours[];

  @OneToMany(() => Appointment, (appointment) => appointment.staff)
  appointments: Appointment[];

  @ManyToMany(() => Service, (service) => service.staff)
  @JoinTable()
  services: Service[];
}
