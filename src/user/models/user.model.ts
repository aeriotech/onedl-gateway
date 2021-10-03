import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Plan, Role, User as PrismaUser } from '@prisma/client';
import { Profile } from 'src/profile/models/profile.model';

registerEnumType(Role, { name: 'Role' });

@ObjectType()
export class User implements PrismaUser {
  @Field((type) => Int)
  id: number;

  @Field((type) => Role)
  role: Role;

  @Field()
  username: string;

  @Field()
  email: string;
  password: string;
  forgotPasswordToken: string;

  @Field()
  plan: Plan;
  profileId: number;

  @Field((type) => Profile)
  profile: Profile;

  @Field()
  emailConfirmed: boolean;
  emailConfirmationSentAt: Date;

  @Field()
  ageConfirmed: boolean;

  @Field((type) => Int)
  score: number;
  lastDaily: Date;
  dailySessionUuid: string;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  updatedAt: Date;
}
