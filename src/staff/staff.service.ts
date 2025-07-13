import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Staff } from './entities/staff.entity';
import { WorkingHours } from './entities/workinghour.entity';
import { getOffset } from '@common/utils/pagination';
import { CreateStaffArg, FetchStaffArg, FetchStaffsArg } from './types';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff) private readonly staffRepo: Repository<Staff>,
    private readonly dataSource: DataSource,
  ) {}

  async createStaff(data: CreateStaffArg): Promise<Staff> {
    const { workingHours, ...staffDetails } = data;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const staff = queryRunner.manager.create(Staff, staffDetails);
      const newStaff = await queryRunner.manager.save(staff);

      if (workingHours && workingHours.length > 0) {
        const hoursToCreate = workingHours.map((wh) =>
          queryRunner.manager.create(WorkingHours, { ...wh, staff: newStaff }),
        );
        await queryRunner.manager.save(hoursToCreate);
      }

      await queryRunner.commitTransaction();

      return this.fetchStaff({ id: newStaff.id });
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(`failed to create staff: ${err.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  async fetchStaffs(data: FetchStaffsArg): Promise<{ data: Staff[]; total: number }> {
    const { page = 1, size = 10 } = data;
    const offset = getOffset(page, size);

    const [staffs, total] = await this.staffRepo.findAndCount({
      take: size,
      skip: offset,
      order: { name: 'ASC' },
      relations: ['workingHours'],
    });

    return { data: staffs, total };
  }

  async fetchStaff(data: FetchStaffArg): Promise<Staff> {
    const staff = await this.staffRepo.findOne({
      where: { id: data.id },
      relations: ['workingHours', 'services'],
    });

    if (!staff) {
      throw new NotFoundException(`staff with not found`);
    }
    return staff;
  }
}
