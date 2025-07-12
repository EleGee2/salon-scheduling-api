import { CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

export class Timestamp {
  @CreateDateColumn()
  created_at: Date | string;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at?: Date | null;
}
