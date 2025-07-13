import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class StaffAvailability {
  @Field(() => Int)
  staffId: number;

  @Field()
  staffName: string;

  @Field(() => [String])
  availableSlots: string[];
}
