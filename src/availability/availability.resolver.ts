import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { AvailabilityService } from './availability.service';
import { StaffAvailability } from './graphql/types';
import { FetchAvailabityDto } from './dto/req.dto';

@Resolver(() => StaffAvailability)
export class AvailabilityResolver {
  constructor(private readonly availabilityService: AvailabilityService) {}

  /**
   * GraphQL Query to get service availability.
   * Mirrors the functionality of the REST endpoint.
   * * Example GQL Query:
   * query GetAvailability($serviceId: Int!, $date: String!) {
   * availability(serviceId: $serviceId, date: $date) {
   * staffId
   * staffName
   * availableSlots
   * }
   * }
   */
  @Query(() => [StaffAvailability], { name: 'availability' })
  async getAvailability(
    @Args('serviceId', { type: () => Int }) serviceId: number,
    @Args('date') date: string,
  ): Promise<StaffAvailability[]> {
    const queryDto: FetchAvailabityDto = { date };
    return this.availabilityService.getAvailability({ serviceId, date: queryDto.date });
  }
}
